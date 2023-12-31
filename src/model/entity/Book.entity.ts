import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BasicDate } from './BasicDate.entity';

@Entity('book')
export class Book extends BasicDate {
  @PrimaryGeneratedColumn({ name: 'book_id' })
  bookId: number;

  @Column()
  isbn13: string; //책 id

  @Column()
  title: string;

  @Column()
  author: string; //MariaDB string[] 사용 불가 + 알라딘 api가 단일 string으로 제공

  @Column()
  content: string; //책 설명

  @Column()
  publisher: string;

  @Column()
  pages: number;

  @Column()
  category: string;

  @Column({ name: 'thumbnail_url' })
  thumbnailURL: string;

  @Column()
  link: string;
  /*
  anything else
  */
}
