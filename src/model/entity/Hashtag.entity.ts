import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BasicDate } from './BasicDate.entity';

@Entity('hashtag')
export class Hashtag extends BasicDate {
  @PrimaryGeneratedColumn({ name: 'hashtag_id' })
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  keyword: string;
}
