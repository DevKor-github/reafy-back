import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_book_history')
export class UserBookHistory {
  @ApiProperty({ description: 'user_book_history_id' })
  @PrimaryGeneratedColumn({ name: 'user_book_history_id' })
  userBookHistoryId: number;

  @ApiProperty({ description: 'bookshelf_book_id' })
  @Column({ name: 'bookshelf_book_id' })
  bookshelfBookId: number;

  @ApiProperty({ description: '시작 시간' })
  @CreateDateColumn({ name: 'start_datetime' })
  startDatetime: Date;

  @ApiProperty({ description: '종료 시간' })
  @CreateDateColumn({ name: 'end_datetime' })
  endDatetime: Date; // js-joda https://jojoldu.tistory.com/600

  @ApiProperty({ description: '독서 시작 페이지' })
  @Column({ name: 'start_page', default: 0 })
  startPage: number;

  @ApiProperty({ description: '독서 종료 페이지' })
  @Column({ name: 'end_page', default: 0 })
  endPage: number;

  @ApiProperty({ description: '독서 시간; 초 단위' })
  @Column() //기록되는 독서 시간
  duration: number;

  @ApiProperty({ description: '코인 습득 정보 PK' })
  @Column({ name: 'coin_history_id' }) //해당 독서로 얻은 코인 습득 정보
  coinHistoryId: number;
}
