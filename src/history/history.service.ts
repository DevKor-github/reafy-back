import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BookShelfRepository } from 'src/book/repository/bookshelf.repository';
import { BookNotFoundException } from 'src/common/exception/book-service.exception';
import { HistoryNotFound } from 'src/common/exception/history-service.exception';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { CreateUserBookHistoryDto } from './dtos/CreateUserBookHistory.dto';
import { UserBookHistoryResDto } from './dtos/UserBookHistoryRes.dto';
import { UserBookHistoryRepository } from './repository/user-book-history.repository';

@Injectable()
export class HistoryService {
  constructor(
    private readonly userBookHistoryRepository: UserBookHistoryRepository,
    private readonly bookshelfRepository: BookShelfRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async getUserBookHistory(userId: number): Promise<UserBookHistoryResDto[]> {
    const resultArray = await this.userBookHistoryRepository.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' },
    });
    if (resultArray.length == 0) {
      this.logger.error(
        `## getUserBookHistory can not find book userId : ${userId}, resultArray : ${JSON.stringify(
          resultArray,
        )}`,
      );
      throw HistoryNotFound();
    }
    return this.processHistoryList(resultArray);
  }

  async getUserBookHistoryByBookshelfBook(
    userId: number,
    bookshelfBookId: number,
  ): Promise<UserBookHistoryResDto[]> {
    const resultArray = await this.userBookHistoryRepository.find({
      where: { userId: userId, bookshelfBookId: bookshelfBookId },
      order: { createdAt: 'DESC' },
    });
    if (resultArray.length == 0) {
      this.logger.error(
        `## can not find book history userId : ${userId}, bookshelfBookId : ${bookshelfBookId}`,
      );
      throw HistoryNotFound();
    }
    return this.processHistoryList(resultArray);
  }

  async createUserBookHistory(
    userId: number,
    createUserBookHistoryDto: CreateUserBookHistoryDto,
  ): Promise<UserBookHistoryResDto> {
    const existedBook = await this.bookshelfRepository.findOne({
      where: {
        userId: userId,
        bookshelfBookId: createUserBookHistoryDto.bookshelfBookId,
      },
    });
    if (!existedBook) {
      this.logger.error(
        `## can not find book userId : ${userId}, createUserBookHistoryDto : ${JSON.stringify(
          createUserBookHistoryDto,
        )}`,
      );
      throw BookNotFoundException();
    }
    return UserBookHistoryResDto.makeRes(
      await this.userBookHistoryRepository.save({
        userId,
        ...createUserBookHistoryDto,
      }),
    );
  }

  processHistoryList(resultArray: any): UserBookHistoryResDto[] {
    const userBookHistoryList = [];
    resultArray.map((history: UserBookHistory) => {
      userBookHistoryList.push(UserBookHistoryResDto.makeRes(history));
    });
    return userBookHistoryList;
  }
}
