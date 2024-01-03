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
import { BookRepository } from './repository/book.repository';
import { BookShelfRepository } from './repository/bookshelf.repository';
import { UserBookHistoryRepository } from 'src/history/repository/user-book-history.repository';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly bookshelfRepository: BookShelfRepository,
    private readonly userBookHistoryRepository: UserBookHistoryRepository,
    private readonly httpService: HttpService,
  ) {}

  findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  //검색어와 pagination으로 검색 결과 반환
  async searchBook(query: string, page: number): Promise<SearchBookResDto[]> {
    const resultArray = await this.httpService.axiosRef.get(
      `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${process.env.ALADIN_API_KEY}&Query=${query}&output=js&Cover=Big&Version=20131101&start=${page}`,
    );
    let SearchBookList: SearchBookResDto[] = [];
    await Promise.all(
      resultArray.data.item.map(async (item) => {
        SearchBookList.push(await SearchBookResDto.makeRes(item));
      }),
    );
    return SearchBookList;
  }

  //내부 책 DB 등록
  async registerBook(isbn13: string): Promise<Book> {
    const result = await this.httpService.axiosRef.get(
      `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${process.env.ALADIN_API_KEY}&itemIdType=ISBN13&ItemId=${isbn13}&Cover=Big&output=js&Version=20131101`,
    );
    const registeredBook: RegisterBookDto = await RegisterBookDto.makeDto(
      result.data.item[0],
    );
    return await this.bookRepository.save(registeredBook);
  }

  //상태 param에 따라 그에 맞는 bookshelfbook 리턴
  async getBookshelfBookOnState(
    userId: number,
    progressState: number,
  ): Promise<BookshelfBookDto[]> {
    const resultArray = await this.bookRepository.getBookshelfBookOnState(
      userId,
      progressState,
    );

    const bookshelfBookListOnState: BookshelfBookDto[] = await Promise.all(
      resultArray.map((book) => {
        return BookshelfBookDto.makeRes(book);
      }),
    );

    return bookshelfBookListOnState;
  }

  //유저 책장에 있는 책의 상세 정보
  async getBookshelfBookDetail(
    userId: number,
    bookshelfbookId: number,
  ): Promise<BookshelfBookDetailDto> {
    const resultArray = await this.bookshelfRepository.getBookshelfBookDetail(
      userId,
      bookshelfbookId,
    );

    const firstHistory =
      await this.userBookHistoryRepository.getStartHistory(bookshelfbookId);
    const lastHistory =
      await this.userBookHistoryRepository.getEndHistory(bookshelfbookId);

    const startPage = firstHistory ? firstHistory.startPage : 0;
    const endPage = lastHistory ? lastHistory.endPage : 0;

    return await BookshelfBookDetailDto.makeRes(
      resultArray[0],
      startPage,
      endPage,
    );
  }

  //검색 결과에서 isbn13을 이용해 유저 책장에 저장
  async saveInBookshelf(
    userId: number,
    userBookItems: SaveInBookshelfReqDto,
  ): Promise<BookshelfBookDetailDto> {
    const bookExist = await this.bookRepository.findOne({
      where: { isbn13: userBookItems.isbn13 },
    });

    if (bookExist) {
      //책이 DB에 존재 -> 책장에 존재하는 지 체크
      const bookshelfBookExist = await this.bookRepository.findOne({
        where: { bookId: bookExist.bookId },
      });
      if (bookshelfBookExist)
        //책장에 존재 -> Error
        throw new HttpException('이미 존재하는 책입니다', HttpStatus.CONFLICT);

      const bookshelfInfo = await this.bookshelfRepository.save({
        userId: userId,
        bookId: bookExist.bookId,
        progressState: userBookItems.progressState,
      });

      return await this.getBookshelfBookDetail(
        bookshelfInfo.userId,
        bookshelfInfo.bookshelfBookId,
      );
    } else {
      //책이 DB에 존재하지 않음
      const newBook = await this.registerBook(userBookItems.isbn13); //책을 내부 DB 추가

      const bookshelfInfo = await this.bookshelfRepository.save({
        userId: userId,
        bookId: newBook.bookId,
        progressState: userBookItems.progressState,
      });

      return await this.getBookshelfBookDetail(
        bookshelfInfo.userId,
        bookshelfInfo.bookshelfBookId,
      );
    }
  }

  async updateBookshelfBook(
    //책의 상태 업데이트
    userId: number,
    bookshelfbookId: number,
    progressState: number,
  ): Promise<BookshelfBookDetailDto> {
    const updatedBookshelfBook = await this.bookshelfRepository.findOneOrFail({
      where: { userId: userId, bookshelfBookId: bookshelfbookId },
    });

    updatedBookshelfBook.progressState = progressState;

    await this.bookshelfRepository.save(updatedBookshelfBook);

    return await this.getBookshelfBookDetail(userId, bookshelfbookId);
  }

  async deleteBookshelfBook(
    userId: number,
    bookshelfbookId: number,
  ): Promise<BookshelfBookDetailDto> {
    const deletedBookshelfBook = await this.getBookshelfBookDetail(
      //삭제되는 책 정보
      userId,
      bookshelfbookId,
    );

    await this.bookshelfRepository.softDelete({
      userId: userId,
      bookshelfBookId: bookshelfbookId,
    });
    return deletedBookshelfBook;
  }

  async getFavoriteBookshelfBook(userId: number): Promise<BookshelfBookDto[]> {
    const resultArray =
      await this.bookRepository.getFavoriteBookshelfBook(userId);

    const favoriteBookshelfBookList: BookshelfBookDto[] = await Promise.all(
      resultArray.map((book) => {
        return BookshelfBookDto.makeRes(book);
      }),
    );

    return favoriteBookshelfBookList;
  }

  async updateFavoriteBookshelfBook(
    userId: number,
    bookshelfbookId: number,
    isFavorite: number,
  ): Promise<BookshelfBookDetailDto> {
    const updatedBookshelfBook = await this.bookshelfRepository.findOneOrFail({
      where: { userId: userId, bookshelfBookId: bookshelfbookId },
    });
    updatedBookshelfBook.isFavorite = isFavorite;
    await this.bookshelfRepository.save(updatedBookshelfBook);
    return await this.getBookshelfBookDetail(userId, bookshelfbookId);
  }
}
