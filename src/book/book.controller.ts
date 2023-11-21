import { Get, Post, Req, Res } from '@nestjs/common';
import { BookService } from './book.service';
import { Controller } from '@nestjs/common';
import { Book } from 'src/model/entity/Book.entity';
import { Query, Param, Body, Put, Delete } from '@nestjs/common/decorators';
import { SaveInBookshelfDto } from './dto/SaveInBookShelf.dto';

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
    @Query('index') index: number = 1,
    @Res() res,
  ) {
    //dto화 필요
    try {
      const result = await this.bookService.searchBook(query, index);
      res.status(200).json(result);
    } catch (e) {
      console.error(e);
      res.status(e.status).json({ message: e.messaage });
    }
    return;
  }

  @Post('/bookshelf') //Retur : 등록된 책의 상세 정보
  async saveInBookshelf(
    @Req() req,
    @Body() userBookItems: SaveInBookshelfDto,
    @Res() res,
  ) {
    try {
      const result = await this.bookService.saveInBookshelf(userBookItems);
      res.status(201).json(result);
    } catch (e) {
      console.error(e);
      res.status(e.status).json({ message: e.messaage });
    }
  }

  //이하는 jwt 도입 시 jwtAutoGuard 적용. userid parameter 제거

  @Get('/bookshelf/:userid') //Return : user id, bookshelfbook id, thumbnail url이 담겨있는 책 리스트
  async getBookshelfBook(
    @Req() req,
    @Param('userid') userid: number,
    @Res() res,
  ) {
    try {
      const result = await this.bookService.getBookshelfBook(userid);
      res.status(200).json(result);
    } catch (e) {
      console.error(e);
      res.status(e.status).json({ message: e.messaage });
    }
  }

  @Get('/bookshelf/:userid/:bookshelfbookid') //Return : 책의 상세 정보
  async getBookshelfBookDetail(
    @Req() req,
    @Param('userid')
    userid: number,
    @Param('bookshelfbookid') bookshelfbookid: number,
    @Res() res,
  ) {
    try {
      const result = await this.bookService.getBookshelfBookDetail(
        userid,
        bookshelfbookid,
      );
      res.status(200).json(result);
    } catch (e) {
      console.error(e);
      res.status(e.status).json({ message: e.message });
    }
  }

  @Put('/bookshelf/:userid/:bookshelfbookid') //Return : 변경된 책의 상세 정보
  async updateBookshelfBook(
    @Req() req,
    @Param('userid') userid: number,
    @Param('bookshelfbookid') bookshelfbookid: number,
    @Body('progressstate') progressstate: string,
    @Res() res,
  ) {
    try {
      const result = await this.bookService.updateBookshelfBook(
        userid,
        bookshelfbookid,
        progressstate,
      );
      res.status(200).json(result);
    } catch (e) {
      console.error(e);
      res.status(e.status).json({ message: e.message });
    } //Dto화 필요
  }

  @Delete('/bookshelf/:userid/:bookshelfbookid') //Return : 삭제된 책의 정보
  async deleteBookshelfBook(
    @Req() req,
    @Param('userid') userid: number,
    @Param('bookshelfbookid') bookshelfbookid: number,
    @Res() res,
  ) {
    try {
      const result = await this.bookService.deleteBookshelfBook(
        userid,
        bookshelfbookid,
      ); //Dto화 필요
      res.status(200).json(result);
    } catch (e) {
      console.error(e);
      res.status(e.status).json({ message: e.message });
    }
  }
}
