import { Get, Post, Req, Res, HttpStatus } from '@nestjs/common';
import { BookService } from './book.service';
import { Controller } from '@nestjs/common';
import { Book } from 'src/model/entity/Book.entity';
import { Query, Param, Body, Put, Delete } from '@nestjs/common/decorators';
import { SaveInBookshelfReqDto } from 'src/book/dto/SaveInBookshelfReq.dto';

@Apitags
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {} //BookService  주입

  @Get()
  getAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }

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

  @Post('/bookshelf') //Retur : 등록된 책의 상세 정보
  async saveInBookshelf(
    @Req() req,
    @Body() userBookItems: SaveInBookshelfReqDto,
  ) {
    try {
      return {
        status: 201,
        response: await this.bookService.saveInBookshelf(userBookItems),
      };
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }

  //이하는 jwt 도입 시 jwtAutoGuard 적용. userid parameter 제거

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

  @Put('/bookshelf/:bookshelfbookId') //Return : 변경된 책의 상세 정보
  async updateBookshelfBook(
    @Req() req,
    @Param('bookshelfbookId') bookshelfbookId: number,
    @Body('progressState') progressState: string,
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
    } //Dto화 필요
  }

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
      }; //Dto화 필요
    } catch (e) {
      return { status: e.HttpStatus, message: e.message };
    }
  }
}
