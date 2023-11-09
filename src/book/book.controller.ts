import { Get, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { Controller } from '@nestjs/common';
import { Book } from 'src/model/entity/Book.entity';
import { Query, Body } from '@nestjs/common/decorators';
import { SaveInBookshelfDto } from './dto/saveinbookshelf.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {} //BookService  주입

  @Get()
  getAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Get('/search')
  searchBook(@Query('query') query: string, @Query('index') index: number) {
    return this.bookService.searchBook(query, index);
  }

  @Post('/register')
  registerBook(@Body('isbn13') isbn13: string) {
    return this.bookService.registerBook(isbn13);
  }

  @Post('/bookshelf')
  saveInBookshelf(@Body() userBookItems: SaveInBookshelfDto) {
    return this.bookService.saveInBookshelf(userBookItems);
  }
}
