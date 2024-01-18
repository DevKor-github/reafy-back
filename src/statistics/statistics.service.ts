import { Injectable } from '@nestjs/common';
import {
  MonthlyTotalPagesListDto,
  MonthlyTotalReadingTimesListDto,
  TodayStatisticsDto,
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

    //독서 기록 유무 상관없이 그 해의 모든 총 페이지 수 반환. 없으면 0으로 뜰 것

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

    //독서 기록 유무 상관없이 그 해의 모든 총 독서 시간 반환. 없으면 0으로 뜰 것
    await Promise.all(
      resultArray.map((resultPacket) => {
        monthlyTotalReadingTimesList.push(
          MonthlyTotalReadingTimesListDto.makeRes(resultPacket),
        );
      }),
    );

    return monthlyTotalReadingTimesList;
  }

  async getTodayStatistics(userId: number): Promise<TodayStatisticsDto> {
    const queryPacket =
      await this.userBookHistoryRepository.getTodayStatistics(userId);
    console.log(queryPacket);
    return TodayStatisticsDto.makeRes(queryPacket[0]);
  }
}
