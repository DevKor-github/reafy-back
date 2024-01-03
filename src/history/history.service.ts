import { Injectable } from '@nestjs/common';
import { CreateUserBookHistoryDto } from './dtos/CreateUserBookHistory.dto';
import { UserBookHistoryRepository } from './repository/user-book-history.repository';
import { UserBookHistoryResDto } from './dtos/UserBookHistoryRes.dto';

@Injectable()
export class HistoryService {
  constructor(
    private readonly userBookHistoryRepository: UserBookHistoryRepository,
  ) {}

  async getUserBookHistory(userId: number): Promise<UserBookHistoryResDto[]> {
    const resultArray = await this.userBookHistoryRepository.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' },
    });
    return await this.ProcessHistoryList(resultArray);
  }

  async getUserBookHistoryByBookshelfBook(
    userId: number,
    bookshelfBookId: number,
  ): Promise<UserBookHistoryResDto[]> {
    const resultArray = await this.userBookHistoryRepository.find({
      where: { userId: userId, bookshelfBookId: bookshelfBookId },
      order: { createdAt: 'DESC' },
    });
    return await this.ProcessHistoryList(resultArray);
  }

  async createUserBookHistory(
    userId: number,
    createUserBookHistoryDto: CreateUserBookHistoryDto,
  ): Promise<UserBookHistoryResDto> {
    return await UserBookHistoryResDto.makeRes(
      await this.userBookHistoryRepository.save({
        userId,
        ...createUserBookHistoryDto,
      }),
    );
  }

  async ProcessHistoryList(resultArray: any): Promise<UserBookHistoryResDto[]> {
    const userBookHistoryList = [];
    await Promise.all(
      resultArray.map(async (history) => {
        userBookHistoryList.push(await UserBookHistoryResDto.makeRes(history));
      }),
    );
    return userBookHistoryList;
  }
}
