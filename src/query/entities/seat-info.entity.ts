import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { TrainInfo } from './train-info.entity';
import { BookingInfo } from './booking-info.entity';

@Entity()
@Index('IDX_SEAT_CLASS', ['class'])  // Index on class for faster seat filtering
export class SeatInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  class: 'Economy' | 'Business' | 'First';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fare: number;

  @ManyToOne(() => TrainInfo, (trainInfo) => trainInfo.seats, { onDelete: 'CASCADE' })
  train: TrainInfo;

  @OneToMany(() => BookingInfo, (bookingInfo) => bookingInfo.seat)
  bookings: BookingInfo[];
}
