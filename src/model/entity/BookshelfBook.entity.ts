import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bookshelf_book')
export class BookshelfBook {
  @PrimaryGeneratedColumn({ name: 'bookshelf_book_id' })
  bookshelfBookId: number;

  @Column({ name: 'user_id' })
  userId: number; //user의 id(논리적 fk)

  @Column({ name: 'book_id' })
  bookId: number; //book의 id(논리적 fk)

  @Column({ name: 'progress_state' })
  progressState: number; //책의 진행도를 index로 표현 (읽기 전 = 0, 읽는 중 = 1, 읽음 = 2)
}
