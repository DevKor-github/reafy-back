import { AuthenticationModule } from './../authentication/authentication.module';
import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/model/entity/Book.entity';
import { HttpModule } from '@nestjs/axios';
import { BookshelfBook } from 'src/model/entity/BookshelfBook.entity';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { BookRepository } from './repository/book.repository';
import { BookShelfRepository } from './repository/bookshelf.repository';
import { UserBookHistoryRepository } from 'src/history/userbookhistory.repository';
import { HistoryModule } from 'src/history/history.module';

@Module({
  controllers: [BookController],
  providers: [BookService, BookRepository, BookShelfRepository],
  imports: [
    TypeOrmModule.forFeature([Book, BookshelfBook, UserBookHistory]),
    HttpModule,
    AuthenticationModule,
    HistoryModule,
  ],
})
export class BookModule {}
