import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from 'src/model/entity/Book.entity';
import { HttpService } from '@nestjs/axios/dist';
import { SearchBookDto } from './dto/SearchBook.dto';
import { RegisterBookDto } from './dto/RegisterBook.dto';
import { BookshelfBook } from 'src/model/entity/BookshelfBook.entity';
import { SaveInBookshelfDto } from './dto/SaveInBookshelf.dto';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { BookshelfBookDto } from './dto/BookshelfBook.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookshelfBook)
    private readonly bookshelfRepository: Repository<BookshelfBook>,
    @InjectRepository(UserBookHistory)
    private readonly userBookHistoryRepository: Repository<UserBookHistory>,
    private readonly httpService: HttpService,
  ) {} //Book repository inject

  findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async searchBook(query: string, index: number): Promise<SearchBookDto[]> {
    const result = await this.httpService
      .get(
        `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${process.env.ALADIN_API_KEY}&Query=${query}&output=js&Version=20131101&start=${index}`,
      )
      .toPromise();
    let resultArray: SearchBookDto[] = [];
    for (let i = 0; i < 10; i++) {
      //음.. 구현이 별로 맘에 들지 않는다
      const tempObj: SearchBookDto = {
        isbn13: result.data.item[i].isbn13,
        cover: result.data.item[i].cover,
        title: result.data.item[i].title,
        author: result.data.item[i].author,
      };
      resultArray.push(tempObj);
    }
    return resultArray;
  }

  async registerBook(isbn13: string): Promise<RegisterBookDto> {
    const result = await this.httpService
      .get(
        `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${process.env.ALADIN_API_KEY}&itemIdType=ISBN13&ItemId=${isbn13}&output=js&Version=20131101`,
      )
      .toPromise();
    const registeredBook: RegisterBookDto = {
      isbn13: result.data.item[0].isbn13,
      title: result.data.item[0].title,
      author: result.data.item[0].author,
      content: result.data.item[0].description,
      publisher: result.data.item[0].publisher,
      pages: result.data.item[0].subInfo.itemPage,
      category: result.data.item[0].categoryName,
      thumbnailURL: result.data.item[0].cover,
      link: result.data.item[0].link,
    };
    return await this.bookRepository.save(registeredBook);
  }

  async getBookshelfBook(userid: number): Promise<BookshelfBookDto[]> {
    //유저 id 받아서 책장의 책 id, 표지 전달, dto화 필요
    const bookshelfBook = await this.bookRepository.query(
      `select user.user_id, book.book_id, book.thumbnail_url 
      from user
      left join bookshelf_book on user.user_id = bookshelf_book.user_id 
      left join book on bookshelf_book.book_id = book.book_id
      where user.user_id = ${userid};`,
    );

    return bookshelfBook;
  }

  async getBookshelfBookDetail(userid: number, bookshelfbookid: number) {
    return await this.bookshelfRepository.query(
      `
      SELECT *
      FROM bookshelf_book
      LEFT JOIN book ON book.book_id = bookshelf_book.book_id
      LEFT JOIN user_book_history ON user_book_history.bookshelf_book_id = bookshelf_book.bookshelf_book_id
      WHERE bookshelf_book.user_id = ${userid} AND bookshelf_book.bookself_book_id = ${bookshelfbookid};
      `,
    );
  }

  async updateBookshelfBook(
    userid: number,
    bookshelfbookid: number,
    progressstate: string,
  ) {
    return await this.bookshelfRepository.update(
      { bookshelfBookId: bookshelfbookid },
      { progressState: progressstate },
    );
  }

  async deleteBookshelfBook(userid: number, bookshelfbookid: number) {
    await this.userBookHistoryRepository.delete({
      bookshelfBookId: bookshelfbookid,
    });
    return await this.bookshelfRepository.delete({
      userId: userid,
      bookshelfBookId: bookshelfbookid,
    });
  }

  async saveInBookshelf(userBookItems: SaveInBookshelfDto) {
    //책 상세 페이지 리턴..
    const bookExist = await this.bookRepository.findOne({
      where: { isbn13: userBookItems.isbn13 },
    });

    if (bookExist) {
      const bookshelfBookExist = await this.bookRepository.findOne({
        where: { bookId: bookExist.bookId },
      });
      if (bookshelfBookExist) return { message: '이미 존재하는 책입니다' }; //추후에 try-catch 에러처리.

      const bookshelfInfo = await this.bookshelfRepository.save({
        userId: userBookItems.userId,
        bookId: bookExist.bookId,
        progressState: userBookItems.progressState,
      });

      await this.userBookHistoryRepository.save({
        bookshelfBookId: bookshelfInfo.bookshelfBookId,
      });

      return bookshelfInfo;
    } else {
      await this.registerBook(userBookItems.isbn13);
      const newBook = await this.bookRepository.findOne({
        where: { isbn13: userBookItems.isbn13 },
      });
      const bookshelfInfo = await this.bookshelfRepository.save({
        userId: userBookItems.userId,
        bookId: newBook.bookId,
        progressState: userBookItems.progressState,
      });

      await this.userBookHistoryRepository.save({
        bookshelfBookId: bookshelfInfo.bookshelfBookId,
      });

      return bookshelfInfo; //코드 중복 -불편-.. 추후에 리팩토링.
    }
  }
}
