import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('book')
export class Book {
  @PrimaryColumn({ name: 'book_id' })
  bookId: string; //openAPI 상에서 불러온 그대로 저장

  @Column()
  title: string;

  @Column()
  authors: string[];

  @Column()
  translators: string[];

  @Column()
  content: string; //책 설명

  @Column()
  publisher: string;
  /*
  anything else
  */
}
