import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BasicDate } from './BasicDate.entity';

@Entity('memo')
export class Memo extends BasicDate {
  @PrimaryGeneratedColumn({ name: 'memo_id' })
  memoId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'bookshelf_book_id' })
  bookshelfBookId: number;

  @Column()
  content: string;

  @Column()
  page: number;

  @Column({ nullable: true })
  imageURL: string;
}
