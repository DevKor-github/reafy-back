import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { BookshelfBook } from 'src/model/entity/BookshelfBook.entity';
import { Coin } from 'src/model/entity/Coin.entity';
import { CoinHistory } from 'src/model/entity/CoinHistory.entity';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { UserBookHistoryRepository } from './repository/user-book-history.repository';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService, UserBookHistoryRepository],
  imports: [
    TypeOrmModule.forFeature([UserBookHistory, BookshelfBook]),
    AuthenticationModule,
  ],
  exports: [UserBookHistoryRepository],
})
export class HistoryModule {}
