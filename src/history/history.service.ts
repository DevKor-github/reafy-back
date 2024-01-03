import { Injectable } from '@nestjs/common';
import { CreateUserBookHistoryDto } from './dtos/CreateUserBookHistory.dto';
import { UserBookHistoryRepository } from './userbookhistory.repository';

@Injectable()
export class HistoryService {
  constructor(
    private readonly userBookHistoryRepository: UserBookHistoryRepository,
  ) {}

  async getUserBookHistory(userId: number) {
    const userBookHistoryList = await this.userBookHistoryRepository.find({
      where: { userId: userId },
    });
    return userBookHistoryList;
  }
  async getUserBookHistoryByBookshelfBook(
    userId: number,
    bookshelfBookId: number,
  ) {
    const userBookHistoryList = await this.userBookHistoryRepository.find({
      where: { userId: userId, bookshelfBookId: bookshelfBookId },
    });
    return userBookHistoryList;
  }
  async createUserBookHistory(
    userId: number,
    createUserBookHistoryDto: CreateUserBookHistoryDto,
  ) {
    return await this.userBookHistoryRepository.save({
      userId,
      ...createUserBookHistoryDto,
    });
  }
}
