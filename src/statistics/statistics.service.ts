import { Injectable } from '@nestjs/common';
import {
  MonthlyTotalPagesListDto,
  MonthlyTotalReadingTimesListDto,
} from './dtos/Statistics.dto';
import { UserBookHistoryRepository } from 'src/history/repository/user-book-history.repository';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly userBookHistoryRepository: UserBookHistoryRepository,
  ) {}

  async getMonthlyTotalPages(
    userId: number,
    year: number,
  ): Promise<MonthlyTotalPagesListDto[]> {
    const monthlyTotalPagesList = [];
    const resultArray =
      await this.userBookHistoryRepository.getMonthlyTotalPages(userId, year);

    await Promise.all(
      resultArray.map((resultPacket) => {
        monthlyTotalPagesList.push(
          MonthlyTotalPagesListDto.makeRes(resultPacket),
        );
      }),
    );

    return monthlyTotalPagesList;
  }

  async getMonthlyTotalReadingTimes(
    userId: number,
    year: number,
  ): Promise<MonthlyTotalReadingTimesListDto[]> {
    const monthlyTotalReadingTimesList = [];
    const resultArray =
      await this.userBookHistoryRepository.getMonthlyTotalReadingTimes(
        userId,
        year,
      );
    await Promise.all(
      resultArray.map((resultPacket) => {
        monthlyTotalReadingTimesList.push(
          MonthlyTotalReadingTimesListDto.makeRes(resultPacket),
        );
      }),
    );

    return monthlyTotalReadingTimesList;
  }
}
