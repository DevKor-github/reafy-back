import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { CoinHistory } from 'src/model/entity/CoinHistory.entity';
import { Coin } from 'src/model/entity/Coin.entity';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([UserBookHistory, CoinHistory, Coin]),
  ],
})
export class StatisticsModule {}
