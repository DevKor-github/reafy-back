import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import {
  MonthlyTotalPagesListDto,
  MonthlyTotalReadingTimesListDto,
  TodayStatisticsDto,
} from './dtos/Statistics.dto';
import { StatisticsService } from './statistics.service';

@ApiTags('Statistics')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('access'))
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) { }

  @ApiOperation({ summary: '월별 읽은 페이지 수' })
  @ApiOkResponse({
    description:
      '현재 유저가 월 별로 읽은 페이지 수를 반환합니다. query parameter로 연도가 주어져야 합니다.',
    type: MonthlyTotalPagesListDto,
    isArray: true,
  })
  @Get('/monthly/pages')
  async getMonthlyTotalPages(@Req() req: Request, @Query('year') year: number) {
    return await this.statisticsService.getMonthlyTotalPages(
      req.user.userId,
      year,
    );
  }

  @ApiOperation({ summary: '월별 총 독서 시간' })
  @ApiOkResponse({
    description:
      '현재 유저의 월 별 총 독서 시간을 반환합니다. 월별 분 단위로 주어집니다. 세부 사항은 같습니다.',
    type: MonthlyTotalReadingTimesListDto,
    isArray: true,
  })
  @Get('/monthly/times')
  async getMonthlyTotalReadingTimes(
    @Req() req: Request,
    @Query('year') year: number,
  ) {
    return await this.statisticsService.getMonthlyTotalReadingTimes(
      req.user.userId,
      year,
    );
  }


  @ApiOperation({ summary: '주별 총 독서 시간' })
  @ApiOkResponse({
    description:
      '현재 유저의 주중 총 독서 시간을 반환합니다. 금주의 독서 시간이 분 단위로 주어집니다. 세부 사항은 같습니다.',
    type: MonthlyTotalReadingTimesListDto,
    isArray: true,
  })
  @Get('/weekly/times')
  async getWeeklyTotalReadingTimes(
    @Req() req: Request,
    @Query('date') dateString: string,
  ) {
    const date = this.statisticsService.getDateYYYYMMDD(dateString);

    return await this.statisticsService.getWeeklyTotalReadingTimes(
      req.user.userId,
      date,
    );
  }

  @ApiOperation({ summary: '오늘 독서 통계' })
  @ApiOkResponse({
    description:
      '현재 유저의 오늘 독서 통계를 반환합니다. 독서 시간은 초 단위.',
    type: TodayStatisticsDto,
  })
  @Get('/today')
  async getTodayStatistics(@Req() req: Request) {
    return await this.statisticsService.getTodayStatistics(req.user.userId);
  }
}
