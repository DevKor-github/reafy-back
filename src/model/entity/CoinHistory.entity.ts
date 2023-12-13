import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { BasicDate } from './BasicDate.entity';

@Entity('coin_history')
export class CoinHistory extends BasicDate {
  @PrimaryGeneratedColumn({ name: 'coin_history_id' })
  coinHistoryId: number;

  @Column({ name: 'coin_id' })
  coinId: number;

  @Column({ name: 'earn_amount', default: 0 })
  earnAmount: number;

  @Column({ name: 'spend_amount', default: 0 }) //값 지정하지 않으면 default 0
  spendAmount: number;

  @Column({ name: 'item_id', nullable: true })
  itemId: number;
}
