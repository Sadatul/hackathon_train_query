import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { BookingInfo } from './booking-info.entity';

@Entity('users')
@Index('IDX_USER_EMAIL', ['email'])  // Index on email for faster lookups
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'username' })
  email: string;

  @Column({ name: 'full_name' })
  name: string;

  @Column({name: 'password'})
  password: string;

  @OneToMany(() => BookingInfo, (bookingInfo) => bookingInfo.user)
  bookings: BookingInfo[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}