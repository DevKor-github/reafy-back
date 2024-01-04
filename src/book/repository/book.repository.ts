import { Injectable } from '@nestjs/common';
import { Book } from 'src/model/entity/Book.entity';
import { BookshelfBook } from 'src/model/entity/BookshelfBook.entity';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { DataSource, Repository } from 'typeorm';
import { RegisterBookDto } from '../dto/RegisterBook.dto';

@Injectable()
export class BookRepository extends Repository<Book> {
  constructor(private dataSource: DataSource) {
    super(Book, dataSource.createEntityManager());
  }

  async getBookshelfBookOnState(userId: number, progressState: number) {
    return await this.query(
      `select user.user_id, bookshelf_book.bookshelf_book_id, book.title,  book.thumbnail_url, book.author, bookshelf_book.progress_state, bookshelf_book.is_favorite 
    from user
    left join bookshelf_book on user.user_id = bookshelf_book.user_id 
    left join book on bookshelf_book.book_id = book.book_id
    where user.user_id = ${userId} and bookshelf_book.progress_state =${progressState} AND bookshelf_book.deleted_at IS NULL;`,
    );
  }

  async getFavoriteBookshelfBook(userId: number) {
    return await this
      .query(`select user.user_id, bookshelf_book.bookshelf_book_id, book.title,  book.thumbnail_url, book.author, bookshelf_book.progress_state, bookshelf_book.is_favorite 
    from user
    left join bookshelf_book on user.user_id = bookshelf_book.user_id 
    left join book on bookshelf_book.book_id = book.book_id
    where user.user_id = ${userId} and bookshelf_book.is_favorite = 1 AND bookshelf_book.deleted_at IS NULL;`);
  }
}
