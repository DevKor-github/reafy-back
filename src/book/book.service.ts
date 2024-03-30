import { HttpService } from '@nestjs/axios/dist';
import { Inject, Injectable, LoggerService, Search } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BookshelfBookDto } from 'src/book/dto/BookshelfBook.dto';
import { RegisterBookDto } from 'src/book/dto/RegisterBook.dto';
import { SaveInBookshelfReqDto } from 'src/book/dto/SaveInBookshelfReq.dto';
import {
  SearchBookResDto,
  SearchBookResWithPagesDto,
} from 'src/book/dto/SearchBookRes.dto';
import {
  AlreadyBookExistException,
  ApiAccessErrorException,
  BookNotFoundException,
  InvalidISBNException,
} from 'src/common/exception/book-service.exception';
import { UserBookHistoryRepository } from 'src/history/repository/user-book-history.repository';
import { Book } from 'src/model/entity/Book.entity';
import { BookshelfBookDetailDto } from './dto/BookshelfBookDetail.dto';
import { BookRepository } from './repository/book.repository';
import { BookShelfRepository } from './repository/bookshelf.repository';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly bookshelfRepository: BookShelfRepository,
    private readonly userBookHistoryRepository: UserBookHistoryRepository,
    private readonly httpService: HttpService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  //검색어와 pagination으로 검색 결과 반환
  async searchBook(
    query: string,
    page: number,
  ): Promise<SearchBookResWithPagesDto> {
    const resultArray = await this.httpService.axiosRef.get(
      `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${process.env.ALADIN_API_KEY}&Query=${query}&output=js&Cover=Big&Version=20131101&start=${page}`,
    );
    //query로 들어가는 건 문자열 취급..
    if (resultArray.data.errorCode) {
      this.logger.error(
        '## cannot get book info from aladin api',
        JSON.stringify(resultArray),
      );
      throw ApiAccessErrorException();
    }
    let SearchBookList: SearchBookResDto[] = [];
    resultArray.data.item.map(async (item) => {
      SearchBookList.push(await SearchBookResDto.makeRes(item));
    });

    //console.log(SearchBookList);
    //원랜 SearchBookList에 들어간 아이템 수를 세려고 했으나 pending처리 되었기 때문에 0으로 나타났음.
    //컨트롤러 단에서 await하면서 처리되는 것으로 보임.

    return SearchBookResWithPagesDto.makeRes(
      resultArray.data.totalResults,
      resultArray.data.item.length,
      Number(page),
      SearchBookList,
    );
  }

  //내부 책 DB 등록
  async registerBook(isbn13: string): Promise<Book> {
    const result = await this.httpService.axiosRef.get(
      `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${process.env.ALADIN_API_KEY}&itemIdType=ISBN13&ItemId=${isbn13}&Cover=Big&output=js&Version=20131101`,
    );
    if (result.data.errorCode == 8) {
      this.logger.error(
        '## cannot get book info by isbn13',
        JSON.stringify(result),
      );
      throw InvalidISBNException();
    }
    const registeredBook: RegisterBookDto = RegisterBookDto.makeDto(
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

    // if (resultArray.length == 0) {
    //   this.logger.error(`## can not find book list userId : ${userId}, progressState : ${progressState}`);
    //   throw BookNotFoundException();
    // }

    const bookshelfBookListOnState: BookshelfBookDto[] = resultArray.map(
      (book) => {
        return BookshelfBookDto.makeRes(book);
      },
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

    // if (resultArray.length === 0) {
    //   this.logger.error(`## can not find book list userId : ${userId}, bookshelfbookId : ${bookshelfbookId}`);
    //   throw BookNotFoundException();
    // }

    const firstHistory =
      await this.userBookHistoryRepository.getStartHistory(bookshelfbookId);
    const lastHistory =
      await this.userBookHistoryRepository.getEndHistory(bookshelfbookId);

    const startPage = firstHistory ? firstHistory.startPage : 0;
    const endPage = lastHistory ? lastHistory.endPage : 0;
    const totalPagesRead = await this.getReadPagesSum(userId, bookshelfbookId);

    return await BookshelfBookDetailDto.makeRes(
      resultArray[0],
      startPage,
      endPage,
      totalPagesRead,
    );
  }

  async getReadPagesSum(
    userId: number,
    bookshelfbookId: number,
  ): Promise<number> {
    const histories = await this.userBookHistoryRepository.find({
      where: { userId: userId, bookshelfBookId: bookshelfbookId },
    });
    const pageSet = new Set();
    for (var history of histories) {
      for (var page = history.startPage; page <= history.endPage; page++) {
        pageSet.add(page);
      }
    }
    return pageSet.size;
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
      const bookshelfBookExist = await this.bookshelfRepository.findOne({
        where: { userId: userId, bookId: bookExist.bookId },
        withDeleted: true,
      });
      console.log(bookshelfBookExist);
      if (bookshelfBookExist) {
        if (bookshelfBookExist.deletedAt == null) {
          //책장에 존재 -> Error
          this.logger.error(
            `## book is exist userId : ${userId}, progressState : ${JSON.stringify(
              userBookItems,
            )}`,
          );
          throw AlreadyBookExistException();
        }
        //삭제되었던 책이라면 restore 후 update로 호출
        await this.bookshelfRepository.restore(
          bookshelfBookExist.bookshelfBookId,
        );
        console.log(`${bookshelfBookExist.bookshelfBookId} has just restored!`);
        return await this.updateBookshelfBook(
          userId,
          bookshelfBookExist.bookshelfBookId,
          userBookItems.progressState,
        );
      }
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
    const updatedBookshelfBook = await this.bookshelfRepository.findOne({
      where: { userId: userId, bookshelfBookId: bookshelfbookId },
    });

    if (!updatedBookshelfBook) {
      this.logger.error(
        `## can not find book  userId : ${userId}, bookshelfbookId : ${bookshelfbookId}, progressState : ${progressState}`,
      );
      throw BookNotFoundException();
    }

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

    if (!deletedBookshelfBook) {
      this.logger.error(
        `## can not find book userId : ${userId}, bookshelfbookId : ${bookshelfbookId}`,
      );
      throw BookNotFoundException();
    }

    await this.bookshelfRepository.softDelete({
      userId: userId,
      bookshelfBookId: bookshelfbookId,
    });
    return deletedBookshelfBook;
  }

  async getFavoriteBookshelfBook(userId: number): Promise<BookshelfBookDto[]> {
    const resultArray =
      await this.bookRepository.getFavoriteBookshelfBook(userId);

    // if (resultArray.length == 0) {
    //   this.logger.error(
    //     `## can not find book userId : ${userId}, resultArray : ${JSON.stringify(
    //       resultArray,
    //     )}`,
    //   );
    //   throw BookNotFoundException();
    // }

    const favoriteBookshelfBookList: BookshelfBookDto[] = resultArray.map(
      (book) => {
        return BookshelfBookDto.makeRes(book);
      },
    );

    return favoriteBookshelfBookList;
  }

  async updateFavoriteBookshelfBook(
    userId: number,
    bookshelfbookId: number,
    isFavorite: number,
  ): Promise<BookshelfBookDetailDto> {
    const updatedBookshelfBook = await this.bookshelfRepository.findOne({
      where: { userId: userId, bookshelfBookId: bookshelfbookId },
    });
    if (!updatedBookshelfBook) {
      this.logger.error(
        `## can not find book userId : ${userId}, bookshelfbookId : ${bookshelfbookId}, isFavorite : ${isFavorite}`,
      );
      throw BookNotFoundException();
    }
    updatedBookshelfBook.isFavorite = isFavorite;
    await this.bookshelfRepository.save(updatedBookshelfBook);
    return await this.getBookshelfBookDetail(userId, bookshelfbookId);
  }
}
