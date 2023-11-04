import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_book_history')
export class UserBookHistory {
  @PrimaryGeneratedColumn({ name: 'user_book_history_id' })
  userBookHistoryId: number;

  @Column({ name: 'bookshelf_book_id' })
  bookshelfBookId: number;

  @Column({ name: 'start_datetime' })
  startDatetime: Date;

  @Column({ name: 'end_datetime' })
  endDatetime: Date; // js-joda https://jojoldu.tistory.com/600

  @Column({ name: 'start_page' })
  startPage: number;

  @Column({ name: 'end_page' })
  endPage: number;
}
