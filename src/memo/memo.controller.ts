import {
  Controller,
  Req,
  HttpStatus,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Delete,
  Put,
  Param,
} from '@nestjs/common';
import { MemoService } from './memo.service';
import { Request } from 'express';
import { CreateMemoDto } from './dtos/CreateMemo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Memo')
//@UseGuards(AuthGuard('access'))
@Controller('memo')
export class MemoController {
  constructor(private readonly memoService: MemoService) {}
  //
  @ApiOperation({
    summary: '모든 메모 가져오기',
    description: '모든 메모 가져오기',
  })
  @ApiOkResponse({
    description: '현재 유저 id로 작성된 모든 메모를 가져옵니다.',
  })
  @Get()
  async getMemoList(@Req() req: Request) {
    try {
      return this.memoService.getMemoList(1);
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }
  //
  @ApiOperation({ summary: '해시태그에 해당하는 모든 메모 가져오기' })
  @ApiOkResponse({
    description: '해당 Hashtag에 해당하는 메모를 가져옵니다.',
  })
  @Get()
  async getMemoListByHashtag(@Req() req: Request) {} //어떻게 처리할 지는 보류.
  //
  @ApiOperation({ summary: '해당 책에 쓰인 모든 메모 가져오기' })
  @ApiOkResponse({ description: '해당 책에 작성된 메모를 가져옵니다' })
  @Get('bookshelfBook')
  async getMemoListByBookshelfBook() {}
  //
  @ApiOperation({ summary: '메모를 작성합니다.' })
  @UseInterceptors(FileInterceptor('file'))
  @Post('create')
  async createMemo(
    @Req() req: Request,
    @Body() createMemoDto: CreateMemoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return {
        status: 201,
        response: await this.memoService.createMemo(1, createMemoDto, file),
      };
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }
  //
  @ApiOperation({ summary: '특정 메모의 정보 가져오기' })
  @ApiOkResponse({ description: '특정 id를 가진 메모의 정보를 가져옵니다.' })
  @Get('/:memoId')
  async getMemoDetail(@Req() req: Request, @Param('memoId') memoId: number) {
    try {
      return {};
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }
  //

  @ApiOperation({ summary: '메모 수정하기' })
  @ApiOkResponse({ description: '이미 작성된 메모의 정보를 변경합니다.' })
  @Put('/:memoId')
  async updateMemo(@Req() req: Request, @Param('memoId') memoId: number) {
    try {
      return {};
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }
  //
  @ApiOperation({ summary: '메모 삭제하기' })
  @ApiOkResponse({ description: '특정 메모를 삭제합니다.' })
  @Delete('/:memoId')
  async deleteMemo(@Req() req: Request, @Param('memoId') memoId: number) {
    try {
      return {};
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }
}
