import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateUserBookHistoryDto } from './dtos/CreateUserBookHistory.dto';
import { Request } from 'express';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  //책 히스토리 만들기 = 독서 기록 만들기
  @Post('/bookshelfbook')
  async createBookshelfBookHistory(
    @Req() req: Request, //Guard에서 유저 정보 추출하기
    @Body() createUserBookHistoryDto: CreateUserBookHistoryDto,
  ) {
    try {
      return {
        status: 201,
        response: await this.historyService.createUserBookHistory(
          1,
          createUserBookHistoryDto,
        ),
      };
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }
}
