import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BasicDate } from './BasicDate.entity';

@Entity('coin')
export class Coin extends BasicDate {
  @PrimaryGeneratedColumn({ name: 'coin_id' })
  coinId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'total_coin', default: 0 })
  totalCoin: number;
}
