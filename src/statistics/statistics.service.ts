import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UserBookHistoryRepository } from 'src/history/repository/user-book-history.repository';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { Between } from 'typeorm';
import {
  MonthlyTotalPagesListDto,
  MonthlyTotalReadingTimesListDto,
  TodayStatisticsDto,
  WeeklyTotalReadingTimesDto,
} from './dtos/Statistics.dto';
import { InvalidDateFormatException } from 'src/common/exception/statistics-service.exception';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly userBookHistoryRepository: UserBookHistoryRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) { }

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

  checkDateFormatYYYYMMDD(dateString : string) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(dateString)) {
      throw InvalidDateFormatException('Invalid date format. Date should be in YYYY-MM-DD format.');
    }
  }

  getDateYYYYMMDD(dateString : string) : Date{
    this.checkDateFormatYYYYMMDD(dateString);    
    return new Date(dateString + 'T00:00:00Z');
  }

  async getWeeklyTotalReadingTimes(
    userId: number,
    date: Date,
  ): Promise<WeeklyTotalReadingTimesDto> {
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay()); // 금주의 독서 기록을 가져오기 위하여 현재 날짜 기준 금주의 시작 날짜 가져옴

    const lastDate = new Date(startDate);
    lastDate.setDate(startDate.getDate() + 6);

    let totalReadingTime = 0;

    const resultArray = await this.userBookHistoryRepository.find({
      where: { userId: userId, createdAt: Between(startDate, lastDate) }
    });

    resultArray.forEach((userBookHistory: UserBookHistory) => {
      totalReadingTime += userBookHistory.duration;
    })
    const weeklyTotalReadingTimesDto = new WeeklyTotalReadingTimesDto(date, totalReadingTime);
    return weeklyTotalReadingTimesDto;
  }


  async getTodayStatistics(userId: number): Promise<TodayStatisticsDto> {
    const queryPacket =
      await this.userBookHistoryRepository.getTodayStatistics(userId);
    return TodayStatisticsDto.makeRes(queryPacket[0]);
  }
}
