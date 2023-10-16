import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bookshelf')
export class Bookshelf {
  @PrimaryGeneratedColumn({ name: 'bookshelf_id' })
  bookshelfId: number;

  @Column({ name: 'user_id' })
  userId: number; //user의 id(논리적 fk)

  @Column({ name: 'book_id' })
  bookId: string; //book의 id(논리적 fk)

  @Column({ name: 'progress_state' })
  progressState: string; //책의 진행도(읽기 전, 읽는 중, 읽음)
}
