import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BookShelfRepository } from 'src/book/repository/bookshelf.repository';
import { BookNotFoundException } from 'src/common/exception/book-service.exception';
import { HistoryNotFound } from 'src/common/exception/history-service.exception';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { CreateUserBookHistoryDto } from './dtos/CreateUserBookHistory.dto';
import { UserBookHistoryResDto } from './dtos/UserBookHistoryRes.dto';
import { UserBookHistoryRepository } from './repository/user-book-history.repository';
import { UserRepository } from 'src/user/repository/user.repository';
import { UserBookHistoryReqDto } from './dtos/user-book-history-req.dto';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toDate } from 'date-fns-tz';
import { PaginatedUserBookHistoryRes } from './dtos/paginated-user-book-history-res.dto';
import { HISTORY_LIST_TAKE } from 'src/common/constant/history.constant';

@Injectable()
export class HistoryService {
  constructor(
    private readonly userBookHistoryRepository: UserBookHistoryRepository,
    private readonly bookshelfRepository: BookShelfRepository,
    private readonly userRepository: UserRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async getUserBookHistory(
    userId: number,
    userBookHistoryReqDto: UserBookHistoryReqDto,
  ): Promise<PaginatedUserBookHistoryRes> {
    const resultArray =
      await this.userBookHistoryRepository.getPaginatedUserBookHistory(
        userId,
        userBookHistoryReqDto,
      );
    const userBookHistoryList = this.processHistoryList(
      resultArray.slice(0, HISTORY_LIST_TAKE),
    );
    const hasNextPage = resultArray.length == HISTORY_LIST_TAKE + 1;
    const cursorId = hasNextPage
      ? resultArray[HISTORY_LIST_TAKE - 1].userBookHistoryId
      : null;

    return new PaginatedUserBookHistoryRes(
      userBookHistoryList,
      cursorId,
      hasNextPage,
    );
  }

  async getRecentUserBookHistory(
    userId,
    userBookHistoryReqDto: UserBookHistoryReqDto,
  ): Promise<UserBookHistoryResDto> {
    const whereOptions = { userId: userId };
    if (userBookHistoryReqDto.bookshelfBookId) {
      whereOptions['bookshelfBookId'] = userBookHistoryReqDto.bookshelfBookId;
    }
    const history = await this.userBookHistoryRepository.findOne({
      where: whereOptions,
      order: { createdAt: 'DESC' },
    });
    return UserBookHistoryResDto.makeRes(history);
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
    await this.userRepository.update(userId, {
      timer: createUserBookHistoryDto.remainedTimer,
    });
    return UserBookHistoryResDto.makeRes(
      await this.userBookHistoryRepository.save({
        userId,
        ...createUserBookHistoryDto, //warning?
      }),
    );
  }

  processHistoryList(
    resultArray: UserBookHistory[],
  ): Record<string, UserBookHistoryResDto[]> {
    const userBookHistoryList: Record<string, UserBookHistoryResDto[]> = {};

    resultArray.forEach((history: UserBookHistory) => {
      const createdAtInKST = toDate(history.createdAt, {
        timeZone: 'Asia/Seoul',
      });
      const koFormat = format(createdAtInKST, 'yyyy년 M월 d일 EEEE', {
        locale: ko,
      });

      if (!userBookHistoryList[koFormat]) {
        userBookHistoryList[koFormat] = [];
      }

      userBookHistoryList[koFormat].push(
        UserBookHistoryResDto.makeRes(history),
      );
    });

    return userBookHistoryList;
  }
}
