import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import { SeatInfo } from './seat-info.entity';
import { User } from './user.entity';

@Entity()
@Index('IDX_BOOKING_DATE', ['journeyDate'])  // Index on journeyDate for efficient filtering
export class BookingInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['Booked', 'Purchased'], default: 'Booked' })
  status: 'Booked' | 'Purchased';

  @Column({ type: 'date' })
  journeyDate: string;

  @Column({ type: 'timestamp', nullable: true })
  expirationTime: Date | null;

  @ManyToOne(() => SeatInfo, (seatInfo) => seatInfo.bookings, { onDelete: 'CASCADE' })
  seat: SeatInfo;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  user: User;
}
