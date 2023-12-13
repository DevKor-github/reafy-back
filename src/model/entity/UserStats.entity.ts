import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BasicDate } from './BasicDate.entity';

@Entity('user_stats')
export class UserStats extends BasicDate {
  @PrimaryGeneratedColumn({ name: 'user_stats_id' })
  userStatsId: number;

  @Column({ name: 'weekly_time' })
  weeklyTime: number;

  @Column({ name: 'monthly_time' })
  monthlyTime: number;

  @Column({ name: 'time_report' })
  time_report: number;
}
