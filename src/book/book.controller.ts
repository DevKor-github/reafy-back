import { Get, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { Controller } from '@nestjs/common';
import { Book } from 'src/model/entity/Book.entity';
import { Query, Param, Body, Put, Delete } from '@nestjs/common/decorators';
import { SaveInBookshelfDto } from './dto/SaveInBookshelf.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {} //BookService  주입

  @Get()
  getAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Get('/search')
  searchBook(@Query('query') query: string, @Query('index') index: number = 1) {
    //dto화 필요
    return this.bookService.searchBook(query, index);
  }

  @Post('/bookshelf')
  saveInBookshelf(@Body() userBookItems: SaveInBookshelfDto) {
    return this.bookService.saveInBookshelf(userBookItems);
  }

  /*
  @Post('/register')
  registerBook(@Body('isbn13') isbn13: string) {
    return this.bookService.registerBook(isbn13);
  }
  */

  @Get('/bookshelf/:userid')
  getBookshelfBook(@Param('userid') userid: number) {
    return this.bookService.getBookshelfBook(userid);
  }

  @Get('/bookshelf/:userid/:bookshelfbookid')
  getBookshelfBookDetail(
    @Param('userid') userid: number,
    @Param('bookshelfbookid') bookshelfbookid: number,
  ) {
    return this.bookService.getBookshelfBookDetail(userid, bookshelfbookid); //Dto화 필요
  }

  @Put('/bookshelf/:userid/:bookshelfbookid')
  updateBookshelfBook(
    @Param('userid') userid: number,
    @Param('bookshelfbookid') bookshelfbookid: number,
    @Body('progressstate') progressstate: string,
  ) {
    return this.bookService.updateBookshelfBook(
      userid,
      bookshelfbookid,
      progressstate,
    ); //Dto화 필요
  }

  @Delete('/bookshelf/:userid/:bookshelfbookid')
  deleteBookshelfBook(
    @Param('userid') userid: number,
    @Param('bookshelfbookid') bookshelfbookid: number,
  ) {
    return this.bookService.deleteBookshelfBook(userid, bookshelfbookid); //Dto화 필요
  }
}

//jwt로 유저 id 가져올 수 있게 merge되면 추가 작업.. userid Param 빼버리고 req에서 user.id 받고, bookshelfbookid만 param으로 받아서 처리..
