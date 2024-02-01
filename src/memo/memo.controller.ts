import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  UploadedFile,
  UseGuards,
  Delete,
  Put,
  Param,
  Query,
} from '@nestjs/common';
import { MemoService } from './memo.service';
import { Request } from 'express';
import { CreateMemoDto } from './dtos/CreateMemo.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiFile } from 'src/common/decorator/apis.decorator';
import { UpdateMemoDto } from './dtos/UpdateMemo.dto';
import { MemoResDto, MemoResWithPagesDto } from './dtos/MemoRes.dto';

@ApiTags('Memo')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('access'))
@Controller('memo')
export class MemoController {
  constructor(private readonly memoService: MemoService) {}
  /*
  현재 유저가 작성한 모든 메모 가져오기, 10 Limit Pagination 적용
  */
  @ApiOperation({
    summary: '모든 메모 가져오기',
    description: '모든 메모 가져오기',
  })
  @ApiOkResponse({
    description:
      '현재 유저 id로 작성된 모든 메모를 가져옵니다. 크기 10의 pagination. 가장 최근에 작성된 것 부터 반환. 이미지는 서버 주소/imageURL로 접근 가능.',
    isArray: false,
    type: MemoResWithPagesDto,
  })
  @Get('')
  async getMemoList(@Req() req: Request, @Query('page') page: number) {
    return await this.memoService.getMemoList(req.user.userId, Number(page));
  }
  /*
  특정 해시태그를 쿼리로 입력하여 해당하는 메모들을 가져옵니다.
  */
  @ApiOperation({ summary: '해시태그에 해당하는 모든 메모 가져오기' })
  @ApiOkResponse({
    description:
      'string으로 특정 Hashtag를 Query로 받아, 해당하는 hashtag를 가진 메모를 가져옵니다. 세부 사항은 전체 메모 반환과 동일',
    isArray: false,
    type: MemoResWithPagesDto,
  })
  @Get('hashtag')
  async getMemoListByHashtag(
    @Req() req: Request,
    @Query('hashtag') hashtag: string,
    @Query('page') page: number,
  ) {
    return await this.memoService.getMemoListByHashtag(
      req.user.userId,
      hashtag,
      Number(page),
    );
  }
  /*
  특정 bookshelfbookId를 받아서 해당 책에 작성된 메모를 가져옵니다.
  */
  @ApiOperation({ summary: '해당 책에 쓰인 모든 메모 가져오기' })
  @ApiOkResponse({
    description:
      'bookshelfBookId를 Query로 받아, 해당 책에 작성된 메모를 가져옵니다. 세부 사항은 동일합니다.',
    isArray: false,
    type: MemoResWithPagesDto,
  })
  @Get('bookshelfbook')
  async getMemoListByBookshelfBook(
    @Req() req: Request,
    @Query('bookshelfBookId') bookshelfBookId: number,
    @Query('page') page: number,
  ) {
    return await this.memoService.getMemoListByBookshelfBook(
      req.user.userId,
      bookshelfBookId,
      Number(page),
    );
  }
  /*
  form-data 형태로 작성을 받습니다.
  DTO와 file을 참고.
  */
  @ApiOperation({
    summary: '메모를 작성합니다.',
    description:
      "form-data 형태로 메모가 작성됩니다. Hashtag는 '경영', '경제' 와 같이, ', '를 구분자로 하는 string 형태로 주어져야 합니다.",
  })
  @ApiFile('create', 'file')
  @ApiCreatedResponse({
    description: '작성된 메모의 정보를 리턴합니다',
    type: MemoResDto,
  })
  @Post('')
  async createMemo(
    @Req() req: Request,
    @Body() createMemoDto: CreateMemoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.memoService.createMemo(
      req.user.userId,
      createMemoDto,
      file,
    );
  }
  /*
  특정 id의 모든 정보를 가져옵니다.
  */
  @ApiOperation({ summary: '특정 메모의 정보 가져오기' })
  @ApiOkResponse({
    description: '특정 id를 가진 메모의 상세 정보를 가져옵니다.',
  })
  @Get('/:memoId')
  async getMemoDetail(@Req() req: Request, @Param('memoId') memoId: number) {
    return await this.memoService.getMemoDetail(req.user.userId, memoId);
  }
  /*
  Param으로 id를 받고 메모를 수정합니다.
  수정 사항이 없는 항목에는 원래 값을 기입하여야 합니다.
  */
  @ApiOperation({
    summary: '메모 수정하기',
    description:
      "form-data 형태로 메모가 작성됩니다. Hashtag는 '경영', '경제' 와 같이, ', '를 구분자로 하는 string 형태로 주어져야 합니다. 수정 사항이 없는 항목에는 원래 정보를 기입해 주세요(덮어쓰기)",
  })
  @ApiFile('update', 'file')
  @ApiOkResponse({
    description: '수정된 메모의 정보를 리턴합니다.',
    isArray: true,
    type: MemoResDto,
  })
  @Put('/:memoId')
  async updateMemo(
    @Req() req: Request,
    @Body() updateMemoDto: UpdateMemoDto,
    @Param('memoId') memoId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.memoService.updateMemo(
      req.user.userId,
      memoId,
      updateMemoDto,
      file,
    );
  }
  /*
  특정 id의 메모를 삭제합니다.
  */
  @ApiOperation({ summary: '메모 삭제하기' })
  @ApiOkResponse({ description: '특정 메모를 삭제합니다.' })
  @Delete('/:memoId')
  async deleteMemo(@Req() req: Request, @Param('memoId') memoId: number) {
    return await this.memoService.deleteMemo(req.user.userId, memoId);
  }
}
