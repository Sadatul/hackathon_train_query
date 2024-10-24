import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { BookingInfo } from './booking-info.entity';

@Entity()
@Index('IDX_USER_EMAIL', ['email'])  // Index on email for faster lookups
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToMany(() => BookingInfo, (bookingInfo) => bookingInfo.user)
  bookings: BookingInfo[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
