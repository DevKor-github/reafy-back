import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from 'src/model/entity/Book.entity';
import { HttpService } from '@nestjs/axios/dist';
import { BookshelfBook } from 'src/model/entity/BookshelfBook.entity';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { BookshelfBookDto } from 'src/book/dto/BookshelfBook.dto';
import { SearchBookResDto } from 'src/book/dto/SearchBookRes.dto';
import { RegisterBookDto } from 'src/book/dto/RegisterBook.dto';
import { SaveInBookshelfReqDto } from 'src/book/dto/SaveInBookshelfReq.dto';
import { BookshelfBookDetailDto } from './dto/BookshelfBookDetail.dto';

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

  async searchBook(query: string, page: number): Promise<SearchBookResDto[]> {
    //query와 page에 맞는 DTO list 리턴. Swagger needed. 200.
    const result = await this.httpService.axiosRef.get(
      `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${process.env.ALADIN_API_KEY}&Query=${query}&output=js&Version=20131101&start=${page}`,
    );
    let resultArray: SearchBookResDto[] = [];
    for (let i = 0; i < 10; i++) {
      resultArray.push(await SearchBookResDto.makeRes(result.data.item[i]));
    }
    return resultArray;
  }

  async registerBook(isbn13: string) {
    //내부 책 DB 등록용 API. 201.
    const result = await this.httpService.axiosRef.get(
      `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${process.env.ALADIN_API_KEY}&itemIdType=ISBN13&ItemId=${isbn13}&output=js&Version=20131101`,
    );
    const registeredBook: RegisterBookDto = await RegisterBookDto.makeDto(
      result.data.item[0],
    );
    return await this.bookRepository.save(registeredBook);
  }

  async getBookshelfBook(userId: number): Promise<BookshelfBookDto[]> {
    //유저 id 받아서 책장의 책 id, 표지 object를 array 형태로 전달. Return DTO & Swagger needed. 200. 책장책 id, 제목, 표지 url을 전달.
    const resultArray = await this.bookRepository.query(
      `select user.user_id, bookshelf_book.bookshelf_book_id, book.title, book.thumbnail_url, bookshelf_book.progress_state 
      from user
      left join bookshelf_book on user.user_id = bookshelf_book.user_id 
      left join book on bookshelf_book.book_id = book.book_id
      where user.user_id = ${userId} ;`,
    );

    const bookshelfBookList: BookshelfBookDto[] = await Promise.all(
      resultArray.map((book) => {
        return BookshelfBookDto.makeRes(book);
      }),
    );
    return bookshelfBookList;
  }

  async getBookshelfBookOnState(
    userId: number,
    progressState: number,
  ): Promise<BookshelfBookDto[]> {
    //상태를 index화 시켜서(0,1,2) param에 따라 그에 맞는 bookshelfbook 리턴
    //유저 id 받아서 책장의 책 id, 표지 object를 array 형태로 전달. Return DTO & Swagger needed. 200. 책장책 id, 제목, 표지 url을 전달.
    const resultArray = await this.bookRepository.query(
      `select user.user_id, bookshelf_book.bookshelf_book_id, book.title, book.thumbnail_url, bookshelf_book.progress_state 
      from user
      left join bookshelf_book on user.user_id = bookshelf_book.user_id 
      left join book on bookshelf_book.book_id = book.book_id
      where user.user_id = ${userId} and bookshelf_book.progress_state =${progressState};`,
    );
    const bookshelfBookListOnState: BookshelfBookDto[] = await Promise.all(
      resultArray.map((book) => {
        return BookshelfBookDto.makeRes(book);
      }),
    );

    return bookshelfBookListOnState;
  }

  async getBookshelfBookDetail(userId: number, bookshelfbookId: number) {
    //유저 id, 책장 책 id 받아서 detail object 전달. DTO & Swagger needed. 200
    console.log(userId);
    console.log(bookshelfbookId);
    const resultArray = await this.bookshelfRepository.query(
      `
      SELECT *
      FROM bookshelf_book
      LEFT JOIN book ON book.book_id = bookshelf_book.book_id
      WHERE bookshelf_book.user_id = ${userId} AND bookshelf_book.bookshelf_book_id = ${bookshelfbookId};
      `,
    );

    const firstPage = await this.userBookHistoryRepository.findOne({
      where: { bookshelfBookId: bookshelfbookId },
      order: { startPage: 'ASC' },
    });
    const lastPage = await this.userBookHistoryRepository.findOne({
      where: { bookshelfBookId: bookshelfbookId },
      order: { endPage: 'DESC' },
    });

    /*console.log(resultArray[0]);
    console.log(firstPage);
    console.log(lastPage);*/

    const startPage = firstPage ? firstPage.startPage : 0;
    const endPage = lastPage ? lastPage.endPage : 0;

    return await BookshelfBookDetailDto.makeRes(
      resultArray[0],
      startPage,
      endPage,
    );
  }

  async saveInBookshelf(userId: number, userBookItems: SaveInBookshelfReqDto) {
    //userId, isbn13, progressState 받아서 저장. return DTO & Swagger Needed. 201.
    const bookExist = await this.bookRepository.findOne({
      where: { isbn13: userBookItems.isbn13 }, //해당 책 isbn13으로 DB 내 검색
    });

    if (bookExist) {
      //존재할 시, 해당 책이 bookshelf에 존재하는지 체크
      const bookshelfBookExist = await this.bookRepository.findOne({
        where: { bookId: bookExist.bookId },
      });
      if (bookshelfBookExist)
        throw new HttpException('이미 존재하는 책입니다', HttpStatus.CONFLICT);

      const bookshelfInfo = await this.bookshelfRepository.save({
        //bookshelf에 없는 책이면 bookshelf에 추가
        userId: userId,
        bookId: bookExist.bookId,
        progressState: userBookItems.progressState,
      });

      /*await this.userBookHistoryRepository.save({
        //userBookHistory 생성
        bookshelfBookId: bookshelfInfo.bookshelfBookId,
      }); userBookHistory는 독서 기록과 관련된 기록.*/

      return await this.getBookshelfBookDetail(
        bookshelfInfo.userId,
        bookshelfInfo.bookshelfBookId,
      );
    } else {
      //해당 책이 book DB에 존재하지 않을 경우
      const newBook = await this.registerBook(userBookItems.isbn13); //책을 book DB에 추가

      const bookshelfInfo = await this.bookshelfRepository.save({
        //bookshelf에 추가
        userId: userId,
        bookId: newBook.bookId,
        progressState: userBookItems.progressState,
      });

      /*await this.userBookHistoryRepository.save({
        bookshelfBookId: bookshelfInfo.bookshelfBookId,
      });*/

      return await this.getBookshelfBookDetail(
        bookshelfInfo.userId,
        bookshelfInfo.bookshelfBookId,
      );
    }
  }

  async updateBookshelfBook(
    //유저 id, 책장 책, progress State 받아서 업데이트 후 업데이트 결과 object 전달. DTO(getBookshelfBookDetailDto) & Swagger needed. 200.
    userId: number,
    bookshelfbookid: number,
    progressState: number,
  ) {
    const updatedBookshelfBook = await this.bookshelfRepository.findOneOrFail({
      where: { userId: userId, bookshelfBookId: bookshelfbookid }, //실패하면 error throw
    });
    updatedBookshelfBook.progressState = progressState;
    await this.bookshelfRepository.save(updatedBookshelfBook);
    return await this.getBookshelfBookDetail(userId, bookshelfbookid);
  }

  async deleteBookshelfBook(userId: number, bookshelfbookId: number) {
    //유저 id, 책장 책 id를 받아 삭제 후 삭제된 데이터 object 전달. DTO(getBookshelDetailfBook) & Swagger needed. 200

    const deletedBookshelfBook = await this.getBookshelfBookDetail(
      userId,
      bookshelfbookId,
    );
    /*await this.userBookHistoryRepository.delete({
      // 나중에 softRemove로 변경.. relation 아니라 cascade 설정 못함.
      bookshelfBookId: bookshelfbookId,
    });*/
    await this.bookshelfRepository.delete({
      // 마찬가지.
      userId: userId,
      bookshelfBookId: bookshelfbookId,
    });
    return deletedBookshelfBook;
  }
}
