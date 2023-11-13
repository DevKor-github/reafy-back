import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('coin_history')
export class CoinHistory {
  @PrimaryGeneratedColumn({ name: 'coin_history_id' })
  coinHistoryId: number;

  @Column({ name: 'coin_id' })
  coinId: number;

  @Column({ name: 'earn_amount' })
  earnAmount: number;

  @Column({ name: 'spend_amount' })
  spendAmount: number;

  @Column({ name: 'item_id' })
  itemId: number;

  @Column({ name: 'reg_date' })
  regDate: Date;
}
