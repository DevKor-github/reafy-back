import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('hashtag')
export class Hashtag {
  @PrimaryGeneratedColumn({ name: 'hashtag_id' })
  id: number;

  @Column()
  keyword: string;
}
