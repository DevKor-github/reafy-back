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
    //query와 index에 맞는 DTO list 리턴. Swagger needed. 200.
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

  async registerBook(isbn13: string) {
    //내부 책 DB 등록용 API. 201.
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

  async saveInBookshelf(userBookItems: SaveInBookshelfDto) {
    //userId, isbn13, progressState 받아서 저장. return DTO & Swagger Needed. 201.
    const bookExist = await this.bookRepository.findOne({
      where: { isbn13: userBookItems.isbn13 }, //해당 책 isbn13으로 DB 내 검색
    });

    if (bookExist) {
      //존재할 시, 해당 책이 bookshelf에 존재하는지 체크
      const bookshelfBookExist = await this.bookRepository.findOne({
        where: { bookId: bookExist.bookId },
      });
      if (bookshelfBookExist) return { message: '이미 존재하는 책입니다' }; //추후에 try-catch 에러처리.

      const bookshelfInfo = await this.bookshelfRepository.save({
        //bookshelf에 없는 책이면 bookshelf에 추가
        userId: userBookItems.userId,
        bookId: bookExist.bookId,
        progressState: userBookItems.progressState,
      });

      await this.userBookHistoryRepository.save({
        //userBookHistory 생성
        bookshelfBookId: bookshelfInfo.bookshelfBookId,
      });

      return bookshelfInfo;
    } else {
      //해당 책이 book DB에 존재하지 않을 경우
      const newBook = await this.registerBook(userBookItems.isbn13); //책을 book DB에 추가

      const bookshelfInfo = await this.bookshelfRepository.save({
        //bookshelf에 추가
        userId: userBookItems.userId,
        bookId: newBook.bookId,
        progressState: userBookItems.progressState,
      });

      await this.userBookHistoryRepository.save({
        bookshelfBookId: bookshelfInfo.bookshelfBookId,
      });

      return bookshelfInfo; //리팩토링 필요
    }
  }

  async getBookshelfBook(userid: number): Promise<BookshelfBookDto[]> {
    //유저 id 받아서 책장의 책 id, 표지 object를 array 형태로 전달. Return DTO & Swagger needed. 200
    const bookshelfBook = await this.bookRepository.query(
      `select user.user_id, bookshelf_book.bookshelf_book_id, book.thumbnail_url 
      from user
      left join bookshelf_book on user.user_id = bookshelf_book.user_id 
      left join book on bookshelf_book.book_id = book.book_id
      where user.user_id = ${userid};`,
    );

    return bookshelfBook;
  }

  async getBookshelfBookDetail(userid: number, bookshelfbookid: number) {
    //유저 id, 책장 책 id 받아서 detail object 전달. DTO & Swagger needed. 200
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
    //유저 id, 책장 책, progress State 받아서 업데이트 후 업데이트 결과 object 전달. DTO(getBookshelfBookDetailDto) & Swagger needed. 200.
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
    //유저 id, 책장 책 id를 받아 삭제 후 삭제된 데이터 object 전달. DTO(getBookshelDetailfBook) & Swagger needed. 200
    await this.userBookHistoryRepository.delete({
      bookshelfBookId: bookshelfbookid,
    });
    return await this.bookshelfRepository.delete({
      userId: userid,
      bookshelfBookId: bookshelfbookid,
    });
  }
}
