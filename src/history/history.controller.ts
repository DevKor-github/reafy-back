import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { CreateUserBookHistoryDto } from './dtos/CreateUserBookHistory.dto';
import { HistoryService } from './history.service';
import { UserBookHistoryReqDto } from './dtos/user-book-history-req.dto';
import { UserBookHistoryResDto } from './dtos/UserBookHistoryRes.dto';
import { PaginatedUserBookHistoryRes } from './dtos/paginated-user-book-history-res.dto';

@ApiTags('History')
@Controller('history')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('access'))
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @ApiOperation({
    summary: '독서 기록 조회',
    description:
      '현재 유저의 전체 독서 기록을 조회합니다. 쿼리로 bookshelfbookId 받아서 특정 책의 독서 기록만 조회하는 것도 가능',
  })
  @ApiOkResponse({
    description: '현재 유저의 독서 기록 목록',
    type: PaginatedUserBookHistoryRes,
  })
  @Get('')
  async getBookshelfBookHistory(
    @Req() req: Request,
    @Query() userBookHistoryReqDto: UserBookHistoryReqDto,
  ) {
    return await this.historyService.getUserBookHistory(
      req.user.userId,
      userBookHistoryReqDto,
    );
  }

  @ApiOperation({
    summary: '가장 최근 독서 기록 조회',
    description: '현재 유저의 최근 독서 기록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '현재 유저의 최근 독서 기록',
    type: UserBookHistoryResDto,
  })
  @Get('/recently')
  async getRecentBookshelfBookHistory(
    @Req() req: Request,
    @Query() userBookHistoryReqDto: UserBookHistoryReqDto,
  ) {
    return await this.historyService.getRecentUserBookHistory(
      req.user.userId,
      userBookHistoryReqDto,
    );
  }

  //책 히스토리 만들기 = 독서 기록 만들기
  @ApiOperation({
    summary: '독서 기록',
    description:
      'CreateUserBookHistoryDto를 받아 독서 기록을 저장합니다. duration은 초 단위입니다',
  })
  @ApiCreatedResponse({
    description: '저장된 독서 기록 정보',
    type: UserBookHistory,
  })
  @Post('')
  async createBookshelfBookHistory(
    @Req() req: Request, //Guard에서 유저 정보 추출하기
    @Body() createUserBookHistoryDto: CreateUserBookHistoryDto,
  ) {
    return await this.historyService.createUserBookHistory(
      req.user.userId,
      createUserBookHistoryDto,
    );
  }
}
