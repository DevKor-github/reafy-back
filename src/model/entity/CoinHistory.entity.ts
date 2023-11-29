import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('coin_history')
export class CoinHistory {
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

  @Column({ name: 'reg_date' }) //이건 무슨 칼럼이더라? 생성일자?
  regDate: Date;
}
