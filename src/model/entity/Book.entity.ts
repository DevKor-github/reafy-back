import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('book')
export class Book {
  @PrimaryColumn({ name: 'book_id' })
  bookId: string; //openAPI 상에서 불러온 그대로 저장

  @Column()
  title: string;

  @Column()
  author: string; //MariaDB string[] 사용 불가 + 알라딘 api가 단일 string으로 제공

  @Column()
  translator: string;

  @Column()
  content: string; //책 설명

  @Column()
  publisher: string;

  @Column()
  pages: number;

  @Column()
  category: number;

  @Column({ name: 'thumbnail_url' })
  thumbnailURL: string;

  @Column()
  link: string;
  /*
  anything else
  */
}
