import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_stats')
export class UserStats {
  @PrimaryGeneratedColumn({ name: 'user_stats_id' })
  userStatsId: number;

  @Column({ name: 'weekly_time' })
  weeklyTime: number;

  @Column({ name: 'monthly_time' })
  monthlyTime: number;

  @Column({ name: 'time_report' })
  time_report: number;
}
