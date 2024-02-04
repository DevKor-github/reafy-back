import { Injectable } from '@nestjs/common';
import { BookshelfBook } from 'src/model/entity/BookshelfBook.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class BookShelfRepository extends Repository<BookshelfBook> {
  constructor(private readonly dataSource: DataSource) {
    super(BookshelfBook, dataSource.createEntityManager());
  }

  async getBookshelfBookDetail(userId: number, bookshelfBookId: number) {
    return await this.query(
      `
      SELECT *
      FROM bookshelf_book
      LEFT JOIN book ON book.book_id = bookshelf_book.book_id
      WHERE bookshelf_book.user_id = ${userId} AND bookshelf_book.bookshelf_book_id = ${bookshelfBookId};
      `,
    ); //상세정보는 삭제되었다 하더라도 조회 가능하도록.
  }
}
