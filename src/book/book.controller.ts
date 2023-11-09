import { Get } from '@nestjs/common';
import { BookService } from './book.service';
import { Controller } from '@nestjs/common';
import { Book } from 'src/model/entity/Book.entity';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {} //BookService  주입

  @Get()
  getAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }
}
