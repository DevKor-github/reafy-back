import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { BookshelfBook } from 'src/model/entity/BookshelfBook.entity';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { UserBookHistoryRepository } from './repository/user-book-history.repository';
import { BookShelfRepository } from 'src/book/repository/bookshelf.repository';
import { UserRepository } from 'src/user/repository/user.repository';

@Module({
  controllers: [HistoryController],
  providers: [
    HistoryService,
    UserBookHistoryRepository,
    BookShelfRepository,
    UserRepository,
  ],
  imports: [
    TypeOrmModule.forFeature([UserBookHistory, BookshelfBook]),
    AuthenticationModule,
  ],
  exports: [UserBookHistoryRepository],
})
export class HistoryModule {}
