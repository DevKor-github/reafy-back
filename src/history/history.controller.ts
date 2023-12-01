import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateUserBookHistoryDto } from './dtos/CreateUserBookHistory.dto';
import { Request } from 'express';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('History')
@Controller('history')
@UseGuards(AuthGuard('access'))
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @ApiOperation({
    summary: '독서 기록 조회',
    description: '현재 유저의 전체 독서 기록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '현재 유저의 독서 기록 목록',
    type: UserBookHistory,
  })
  @Get('/bookshelfbook')
  async getBookshelfBookHistory(@Req() req: Request) {
    try {
      return {
        status: 200,
        response: await this.historyService.getUserBookHistory(req.user.userId),
      };
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }
  //책 히스토리 만들기 = 독서 기록 만들기
  @ApiOperation({
    summary: '독서 기록',
    description: 'CreateUserBookHistoryDto를 받아 독서 기록을 저장합니다.',
  })
  @ApiCreatedResponse({
    description: '저장된 독서 기록 정보',
    type: UserBookHistory,
  })
  @Post('/bookshelfbook')
  async createBookshelfBookHistory(
    @Req() req: Request, //Guard에서 유저 정보 추출하기
    @Body() createUserBookHistoryDto: CreateUserBookHistoryDto,
  ) {
    try {
      return {
        status: 201,
        response: await this.historyService.createUserBookHistory(
          req.user.userId,
          createUserBookHistoryDto,
        ),
      };
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }
}
