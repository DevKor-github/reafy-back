import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { HistoryModule } from 'src/history/history.module';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([UserBookHistory]),
    HistoryModule,
  ],
})
export class StatisticsModule {}
