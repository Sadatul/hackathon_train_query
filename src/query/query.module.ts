import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BookingInfo } from './entities/booking-info.entity';
import { TrainInfo } from './entities/train-info.entity';
import { ScheduleInfo } from './entities/schedule-info.entity';
import { SeatInfo } from './entities/seat-info.entity';
import { QueryController } from './query.controller';
import { QueryService } from './query.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, BookingInfo, TrainInfo, ScheduleInfo, SeatInfo])],
    controllers: [QueryController],
    providers: [QueryService],
})
export class QueryModule { }
