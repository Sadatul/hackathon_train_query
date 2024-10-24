import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { SeatInfo } from './seat-info.entity';
import { ScheduleInfo } from './schedule-info.entity';

@Entity()
@Index('IDX_TRAIN_NAME', ['name'])  // Index on train name for faster lookups
export class TrainInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  otherInfo: string;

  @OneToMany(() => SeatInfo, (seatInfo) => seatInfo.train)
  seats: SeatInfo[];

  @OneToMany(() => ScheduleInfo, (scheduleInfo) => scheduleInfo.train)
  schedules: ScheduleInfo[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
