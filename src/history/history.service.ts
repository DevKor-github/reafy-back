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
  ): Promise<UserBookHistoryResDto[]> {
    // if (userBookHistoryReqDto.bookshelfBookId) {
    //   return await this.getUserBookHistoryByBookshelfBook(
    //     userId,
    //     userBookHistoryReqDto.bookshelfBookId,
    //   );
    // }
    const resultArray =
      await this.userBookHistoryRepository.getPaginatedUserBookHistory(
        userId,
        userBookHistoryReqDto,
      );
    // if (resultArray[1] == 0) {
    //   this.logger.error(
    //     `## getUserBookHistory can not find book userId : ${userId}, resultArray : ${JSON.stringify(
    //       resultArray,
    //     )}`,
    //   );
    //   throw HistoryNotFound();
    // } 리스트를 반환받을 때 NotFOund는 의도되지 않은 에러.
    return this.processHistoryList(resultArray); //포맷 수정 필요
  }

  async getUserBookHistoryByBookshelfBook(
    userId: number,
    bookshelfBookId: number,
  ): Promise<UserBookHistoryResDto[]> {
    const resultArray = await this.userBookHistoryRepository.find({
      where: { userId: userId, bookshelfBookId: bookshelfBookId },
      order: { createdAt: 'DESC' },
    });
    // if (resultArray.length == 0) {
    //   this.logger.error(
    //     `## can not find book history userId : ${userId}, bookshelfBookId : ${bookshelfBookId}`,
    //   );
    //   throw HistoryNotFound();
    // }
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

  processHistoryList(resultArray: any): UserBookHistoryResDto[] {
    const userBookHistoryList = [];
    resultArray.map((history: UserBookHistory) => {
      userBookHistoryList.push(UserBookHistoryResDto.makeRes(history));
    });
    return userBookHistoryList;
  }
}
