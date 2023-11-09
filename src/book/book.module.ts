import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/model/entity/Book.entity';
import { HttpModule } from '@nestjs/axios';
import { BookshelfBook } from 'src/model/entity/BookshelfBook.entity';

@Module({
  controllers: [BookController],
  providers: [BookService],
  imports: [TypeOrmModule.forFeature([Book, BookshelfBook]), HttpModule],
})
export class BookModule {}
