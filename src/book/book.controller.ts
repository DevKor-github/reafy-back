import { Get, Post, Req, Res, HttpStatus } from '@nestjs/common';
import { BookService } from './book.service';
import { Controller } from '@nestjs/common';
import { Book } from 'src/model/entity/Book.entity';
import { Query, Param, Body, Put, Delete } from '@nestjs/common/decorators';
import { SaveInBookshelfReqDto } from 'src/book/dto/SaveInBookshelfReq.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SearchBookResDto } from './dto/SearchBookRes.dto';
import { BookshelfBookDetailDto } from './dto/BookshelfBookDetail.dto';
import { BookshelfBookDto } from './dto/BookshelfBook.dto';

@ApiTags('BookService')
@ApiBadRequestResponse({ description: 'Bad Request' })
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {} //BookService  주입

  @ApiOperation({
    summary: '책 검색하기',
    description:
      '검색어 Query와 Page를 받아 알라딘 APi를 통한 검색 결과를 노출합니다. 페이지는 10개 단위로 주어지며, 응답은 SearchBookResDto의 리스트 형태로 주어집니다.',
  })
  @ApiOkResponse({ description: '검색 결과 출력', type: SearchBookResDto })
  @Get('/search') // Return : 검색 결과 리스트(10개 단위)
  async searchBook(
    @Req() req,
    @Query('query') query: string,
    @Query('page') page: number = 1,
  ) {
    //dto화 필요
    try {
      return {
        status: 200,
        response: await this.bookService.searchBook(query, page),
      };
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }

  @ApiOperation({
    summary: '책장에 책 등록하기',
    description:
      'SaveInBookshelfReqDto에 정의된 정보를 POST하여, 해당 책을 유저 책장에 추가합니다. 저장된 책의 정보가 응답 정보로 주어집니다.',
  })
  @ApiCreatedResponse({
    description: '책장에 책 등록',
    type: BookshelfBookDetailDto,
  })
  @Post('/bookshelf') //Retur : 등록된 책의 상세 정보
  async saveInBookshelf(
    @Req() req,
    @Body() saveInBookshelfReqDto: SaveInBookshelfReqDto,
  ) {
    try {
      return {
        status: 201,
        response: await this.bookService.saveInBookshelf(
          1,
          saveInBookshelfReqDto,
        ), // userId = 1
      };
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }

  //이하는 jwt 도입 시 jwtAutoGuard 적용. userid parameter 제거
  @ApiOperation({
    summary: '책장 조회하기',
    description:
      '책장을 조회합니다. bookshelfId, bookId, title, thumbnaulURL, progressState가 담겨 있는 리스트를 반환합니다.',
  })
  @ApiOkResponse({
    description: '책장 조회 결과 출력',
    type: BookshelfBookDto,
  })
  @Get('/bookshelf') //Return : user id, bookshelfbook id, thumbnail url이 담겨있는 책 리스트
  async getBookshelfBook(@Req() req) {
    try {
      return {
        status: 200,
        response: await this.bookService.getBookshelfBook(1),
      }; //요청 오브젝트에서 user Id 가져오기
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }

  @ApiOperation({
    summary: '상태별 책장 조회하기; 전 = 0, 중 = 1, 후 = 2',
    description:
      '상태별로 책장을 조회합니다. Query로 progressState를 받아 BookshelfBookDto가 담겨 있는 리스트를 반환합니다.',
  })
  @ApiOkResponse({
    description: '해당 상태의 책장 조회 결과 출력',
    type: BookshelfBookDto,
  })
  @Get('/bookshelf') //Return : user id, bookshelfbook id, thumbnail url이 담겨있는 책 리스트
  async getBookshelfBookOnState(
    @Req() req,
    @Query('progressState') progressState: number,
  ) {
    try {
      return {
        status: 200,
        response: await this.bookService.getBookshelfBookOnState(
          1,
          progressState,
        ),
      }; //요청 오브젝트에서 user Id 가져오기
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }

  @ApiOperation({
    summary: '책장 책 상세 정보 조회하기',
    description:
      '특정 BookshelfBookId를 Param으로 받아 해당 책의 상세 정보를 반환합니다.',
  })
  @ApiOkResponse({
    description: '책 상세 정보 출력',
    type: BookshelfBookDetailDto,
  })
  @Get('/bookshelf/:bookshelfbookId') //Return : 책의 상세 정보
  async getBookshelfBookDetail(
    @Req() req,
    @Param('bookshelfbookId') bookshelfbookId: number,
  ) {
    try {
      return {
        status: 200,
        response: await this.bookService.getBookshelfBookDetail(
          1, //userId
          bookshelfbookId,
        ),
      };
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }

  @ApiOperation({
    summary: '책장 정보 업데이트하기',
    description:
      '특정 BookshelfBookId를 Param으로 받고, Body로 progressState를 받아 해당 상태로 책 상태를 변경합니다.',
  })
  @ApiOkResponse({
    description: '업데이트된 책 상태 출력',
    type: BookshelfBookDetailDto,
  })
  @Put('/bookshelf/:bookshelfbookId') //Return : 변경된 책의 상세 정보
  async updateBookshelfBook(
    @Req() req,
    @Param('bookshelfbookId') bookshelfbookId: number,
    @Body('progressState') progressState: number,
  ) {
    try {
      return {
        status: 200,
        response: await this.bookService.updateBookshelfBook(
          1, //userId
          bookshelfbookId,
          progressState,
        ),
      };
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }

  @ApiOperation({
    summary: '책장 책 삭제하기',
    description:
      '특정 BookshelfBookId를 Param으로 받아, 해당하는 책을 내 책장에서 삭제합니다.',
  })
  @ApiOkResponse({
    description: '삭제된 책 정보 출력',
    type: BookshelfBookDetailDto,
  })
  @Delete('/bookshelf/:bookshelfbookId') //Return : 삭제된 책의 정보
  async deleteBookshelfBook(
    @Req() req,
    @Param('bookshelfbookId') bookshelfbookId: number,
  ) {
    try {
      return {
        status: 200,
        response: await this.bookService.deleteBookshelfBook(
          1, //userId
          bookshelfbookId,
        ),
      };
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }
}
