import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { Request } from 'express';
import {
  MonthlyTotalPagesListDto,
  MonthlyTotalReadingTimesListDto,
  TodayStatisticsDto,
} from './dtos/Statistics.dto';

@ApiTags('Statistics')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('access'))
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiOperation({ summary: '월별 읽은 페이지 수' })
  @ApiOkResponse({
    description:
      '현재 유저가 월 별로 읽은 페이지 수를 반환합니다. query parameter로 연도가 주어져야 합니다.',
    type: MonthlyTotalPagesListDto,
    isArray: true,
  })
  @Get('/pages')
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
  @Get('/times')
  async getMonthlyTotalReadingTimes(
    @Req() req: Request,
    @Query('year') year: number,
  ) {
    return await this.statisticsService.getMonthlyTotalReadingTimes(
      req.user.userId,
      year,
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
