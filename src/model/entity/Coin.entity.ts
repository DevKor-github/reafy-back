import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('coin')
export class Coin {
  @PrimaryGeneratedColumn({ name: 'coin_id' })
  coinId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'total_coin' })
  totalCoin: number;
}
