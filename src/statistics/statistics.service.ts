import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UserBookHistoryRepository } from 'src/history/repository/user-book-history.repository';
import {
  MonthlyTotalPagesListDto,
  MonthlyTotalReadingTimesListDto,
  TodayStatisticsDto,
} from './dtos/Statistics.dto';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly userBookHistoryRepository: UserBookHistoryRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async getMonthlyTotalPages(
    userId: number,
    year: number,
  ): Promise<MonthlyTotalPagesListDto[]> {
    const monthlyTotalPagesList = [];
    const resultArray =
      await this.userBookHistoryRepository.getMonthlyTotalPages(userId, year);

    //독서 기록 유무 상관없이 그 해의 모든 총 페이지 수 반환. 없으면 0으로 뜰 것

    resultArray.map((resultPacket) => {
      monthlyTotalPagesList.push(
        MonthlyTotalPagesListDto.makeRes(resultPacket),
      );
    });

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

    resultArray.map((resultPacket) => {
      monthlyTotalReadingTimesList.push(
        MonthlyTotalReadingTimesListDto.makeRes(resultPacket),
      );
    });
    return monthlyTotalReadingTimesList;
  }

  async getTodayStatistics(userId: number): Promise<TodayStatisticsDto> {
    const queryPacket =
      await this.userBookHistoryRepository.getTodayStatistics(userId);
    return TodayStatisticsDto.makeRes(queryPacket[0]);
  }
}
