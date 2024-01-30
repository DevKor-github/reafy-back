import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BasicDate } from './BasicDate.entity';

@Entity('memo_hashtag')
export class MemoHashtag extends BasicDate {
  @PrimaryGeneratedColumn({ name: 'memo_hashtag_id' })
  memoHashtagId: number;

  @Column({ name: 'hashtag_id' })
  hashtagId: number;

  @Column({ name: 'memo_id' })
  memoId: number;
}
