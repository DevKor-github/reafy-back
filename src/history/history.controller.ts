import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateUserBookHistoryDto } from './dtos/CreateUserBookHistory.dto';
import { Request } from 'express';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';

@ApiTags('History')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

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
          1,
          createUserBookHistoryDto,
        ),
      };
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }
}
