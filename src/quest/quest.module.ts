import { Module } from '@nestjs/common';
import { QuestController } from './quest.controller';
import { QuestService } from './quest.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinModule } from '../coin/coin.module';
import { Quest } from '../model/entity/Quest.entity';
import { QuestHistory } from '../model/entity/QuestHistory.entity';
import { QuestRepository } from './repository/quest.repository';
import { QuestHistoryRepository } from './repository/quest-history.repository';

@Module({
  controllers: [QuestController],
  providers: [QuestService, QuestRepository, QuestHistoryRepository],
  imports: [CoinModule, TypeOrmModule.forFeature([Quest, QuestHistory])],
})
export class QuestModule {}
