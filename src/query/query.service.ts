import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleInfo } from './entities/schedule-info.entity';
import { Repository } from 'typeorm';
import { TrainInfo } from './entities/train-info.entity';
import { SeatInfo } from './entities/seat-info.entity';
import { BookingInfo } from './entities/booking-info.entity';

type queryType = {
    from: string,
    to: string,
    journeyDate: string
}

@Injectable()
export class QueryService {
    constructor(
        @InjectRepository(ScheduleInfo) private scheduleInfoRepository: Repository<ScheduleInfo>,
        @InjectRepository(TrainInfo) private trainInfoRepository: Repository<TrainInfo>,
        @InjectRepository(SeatInfo) private seatInfoRepository: Repository<SeatInfo>,
        @InjectRepository(BookingInfo) private bookingInfoRepository: Repository<BookingInfo>,
    ) { }

    // async queryTrain(query: queryType) {
    //     const { from, to, journeyDate } = query;

    //     const schedules = await this.scheduleInfoRepository.find({
    //         where: {
    //             origin: from,
    //             destination: to,
    //             date: journeyDate as string
    //         }
    //     });
    //     const results = [];

    //     for (const schedule of schedules) {
    //         // 2. Get train information for each scheduled train
    //         const train = await this.trainInfoRepository.findOne({
    //             where: { id: schedule.train.id },
    //         });

    //         // 3. Get all seats for the train from the SeatInfo table
    //         const seats = await this.seatInfoRepository.find({
    //             where: { train: schedule.train },
    //         });

    //         // Create a new array to store seat information with status
    //         const seatData = [];

    //         for (const seat of seats) {
    //             // 4. Check the bookingInfo table for the seat status for the given journey date
    //             const booking = await this.bookingInfoRepository.findOne({
    //                 where: { seat: seat, journeyDate: journeyDate as string },
    //             });

    //             // Determine the seat status
    //             let status = 'Free'; // Default status
    //             if (booking) {
    //                 status = booking.status; // Booked or Purchased status from BookingInfo table
    //             }

    //             // 5. Construct seat data with status
    //             seatData.push({
    //                 seatId: seat.id,
    //                 class: seat.class,
    //                 fare: seat.fare,
    //                 status: status, // Free, Booked, or Purchased
    //             });
    //         }

    //         // 6. Construct train data with seats and add to the result
    //         results.push({
    //             trainId: schedule.train.id,
    //             trainName: train.name,
    //             seats: seatData,
    //         });
    //     }
    //     return results;
    // }

    async queryTrain(query: queryType) {
        const { from, to, journeyDate } = query;
        console.log("query", query)

        const results = await this.scheduleInfoRepository
            .createQueryBuilder('schedule')
            .where('schedule.origin = :from', { from })
            .andWhere('schedule.destination = :to', { to })
            .andWhere('schedule.date = :journeyDate', { journeyDate: journeyDate as string })
            .leftJoinAndSelect('schedule.train', 'train')
            .leftJoinAndSelect('train.seats', 'seat')
            .leftJoinAndSelect(
                'seat.bookings',
                'booking',
                'booking.journeyDate = :journeyDate',
                { journeyDate: journeyDate as string }
            )
            .select([
                'schedule.id',
                'train.id',
                'train.name',
                'seat.id',
                'seat.class',
                'seat.fare',
                'booking.status',
            ])
            .getMany();

        // Construct the final result
        return results.map(schedule => {
            const train = schedule.train;
            const seats = train.seats.map(async seat => {
                const booking = seat.bookings[0]; // Since booking is already filtered by journeyDate
                const curretTime = new Date().getTime();
                const expirationTime = booking ? booking.expirationTime?.getTime() : null;
                // check if the expiration time is passed and then delete if it is
                if (booking && expirationTime && curretTime > expirationTime && booking.status === 'Booked') {
                    await this.bookingInfoRepository.remove(booking);
                    return {
                        seatId: seat.id,
                        class: seat.class,
                        fare: seat.fare,
                        status: 'Free', // Default status is Free
                    };
                }
                return {
                    seatId: seat.id,
                    class: seat.class,
                    fare: seat.fare,
                    status: booking ? booking.status : 'Free', // Default status is Free
                };
            });

            return {
                trainId: train.id,
                trainName: train.name,
                seats: seats,
            };
        });
    }


}
