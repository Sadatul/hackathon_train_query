import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import { TrainInfo } from './train-info.entity';

@Entity()
@Index('IDX_ORIGIN_DESTINATION_DATE', ['origin', 'destination', 'date'])  // Composite index for optimized queries
export class ScheduleInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  origin: string;  // 'from' is a reserved keyword

  @Column()
  destination: string;  // 'to' is a reserved keyword

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;

  @ManyToOne(() => TrainInfo, (trainInfo) => trainInfo.schedules, { onDelete: 'CASCADE' })
  train: TrainInfo;
}
