import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_book_history')
export class UserBookHistory {
  @PrimaryGeneratedColumn({ name: 'user_book_history_id' })
  userBookHistoryId: number;

  @Column({ name: 'bookshelf_book_id' })
  bookshelfBookId: number;

  @CreateDateColumn({ name: 'start_datetime' })
  startDatetime: Date;

  @CreateDateColumn({ name: 'end_datetime' })
  endDatetime: Date; // js-joda https://jojoldu.tistory.com/600

  @Column({ name: 'start_page', default: 0 })
  startPage: number;

  @Column({ name: 'end_page', default: 0 })
  endPage: number;

  @Column() //기록되는 독서 시간
  duration: number;

  @Column({ name: 'coin_history_id' }) //해당 독서로 얻은 코인 습득 정보
  coinHistoryId: number;
}
