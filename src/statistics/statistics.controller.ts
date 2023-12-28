import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpStatus,
  Req,
} from '@nestjs/common';
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
  MonthlyTotalCoinsListDto,
  MonthlyTotalPagesListDto,
  MonthlyTotalReadingTimesListDto,
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
    try {
      return await this.statisticsService.getMonthlyTotalPages(
        req.user.userId,
        year,
      );
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }

  @ApiOperation({ summary: '월별 얻은 대나무(코인) 수' })
  @ApiOkResponse({
    description:
      '현재 유저가 월 별로 얻은 코인 수를 반환합니다. 세부 사항은 같습니다.',
    type: MonthlyTotalCoinsListDto,
    isArray: true,
  })
  @Get('/coins')
  async getMonthlyTotalCoins(@Req() req: Request, @Query('year') year: number) {
    try {
      return await this.statisticsService.getMonthlyTotalEarnedCoins(
        req.user.userId,
        year,
      );
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }

  @ApiOperation({ summary: '월별 총 독서 시간' })
  @ApiOkResponse({
    description:
      '현재 유저의 월 별 총 독서 시간을 반환합니다. 분 단위로 주어집니다. 세부 사항은 같습니다.',
    type: MonthlyTotalReadingTimesListDto,
    isArray: true,
  })
  @Get('/times')
  async getMonthlyTotalReadingTimes(
    @Req() req: Request,
    @Query('year') year: number,
  ) {
    try {
      return await this.statisticsService.getMonthlyTotalReadingTimes(
        req.user.userId,
        year,
      );
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }
}
