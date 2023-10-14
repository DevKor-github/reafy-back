import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class memo_hashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hashtag_id: number;

  @Column()
  memo_id: number;
}
