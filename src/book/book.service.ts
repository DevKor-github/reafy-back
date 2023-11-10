import { Query } from '@nestjs/common/decorators';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from 'src/model/entity/Book.entity';
import { HttpService } from '@nestjs/axios/dist';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { SearchBookDto } from './dto/searchbook.dto';
import { RegisterBookDto } from './dto/registerbook.dto';
import { BookshelfBook } from 'src/model/entity/BookshelfBook.entity';
import { SaveInBookshelfDto } from './dto/saveinbookshelf.dto';
import { register } from 'module';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';

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

  async registerBook(isbn13: string): Promise<any> {
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

  async getBookshelfBook(userid: number) {
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

  async getBookshelfBookDetail(userid: number, bookid: number) {
    const bookshelfBookDetail = await this.bookshelfRepository.query(
      `
      SELECT *
      FROM bookshelf_book
      LEFT JOIN 
      LEFT JOIN
      WHERE bookshelf_book.user_id = ${userid} AND bookshelf_book.book_id = ${bookid}
      `,
    );
  }

  async saveInBookshelf(userBookItems: SaveInBookshelfDto) {
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
