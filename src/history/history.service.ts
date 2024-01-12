import { Injectable } from '@nestjs/common';
import { CreateUserBookHistoryDto } from './dtos/CreateUserBookHistory.dto';
import { UserBookHistoryRepository } from './repository/user-book-history.repository';
import { UserBookHistoryResDto } from './dtos/UserBookHistoryRes.dto';
import { HistoryNotFound } from 'src/common/exception/history-service.exception';
import { BookShelfRepository } from 'src/book/repository/bookshelf.repository';
import { BookNotFoundException } from 'src/common/exception/book-service.exception';

@Injectable()
export class HistoryService {
  constructor(
    private readonly userBookHistoryRepository: UserBookHistoryRepository,
    private readonly bookshelfRepository: BookShelfRepository,
  ) {}

  async getUserBookHistory(userId: number): Promise<UserBookHistoryResDto[]> {
    const resultArray = await this.userBookHistoryRepository.find({
      where: { userId: userId },
      order: { createdAt: 'DESC' },
    });
    if (resultArray.length == 0) throw HistoryNotFound();
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
    if (resultArray.length == 0) throw HistoryNotFound();
    return await this.ProcessHistoryList(resultArray);
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
    console.log(existedBook);
    if (!existedBook) throw BookNotFoundException();
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
