import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('memo')
export class Memo {
  @PrimaryGeneratedColumn({ name: 'memo_id' })
  id: number;

  @Column({ name: 'bookshelf_book_id' })
  bookshelfBookId: number;

  @Column()
  content: string;

  @Column()
  page: number;
}
