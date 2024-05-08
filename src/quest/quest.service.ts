import {
  BadRequestException,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { QuestRepository } from './repository/quest.repository';
import { QuestHistoryRepository } from './repository/quest-history.repository';
import {
  QuestDto,
  QuestHistoryDto,
  QuestHistoryListDto,
  QuestListDto,
} from './dtos/quest.dto';
import { Quest, QuestType } from '../model/entity/Quest.entity';
import { QuestHistory } from '../model/entity/QuestHistory.entity';
import { CoinService } from '../coin/coin.service';
import { Between } from 'typeorm';
import { InvalidQuestId } from '../common/exception/quest-service.exception';

@Injectable()
export class QuestService {
  constructor(
    private readonly questRepository: QuestRepository,
    private readonly questHistoryRepository: QuestHistoryRepository,
    private readonly coinService: CoinService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async createQuest(questDto: QuestDto): Promise<QuestDto> {
    const questEntity: Quest = Quest.newEntity(
      questDto.type,
      questDto.description,
      questDto.coin,
      questDto.period,
    );
    const savedQuest = await this.questRepository.save(questEntity);
    return QuestDto.makeRes(savedQuest);
  }

  async createDefaultQuest(): Promise<QuestListDto> {
    const questEntityList: Quest[] = [];
    questEntityList.push(
      Quest.newEntity(QuestType.PERIOD, '주 당 누적 독서 5시간', 5, 7),
      Quest.newEntity(QuestType.PERIOD, '주 당 누적 독서 10시간', 10, 7),
      Quest.newEntity(QuestType.PERIOD, '주 당 누적 독서 15시간', 15, 7),
      Quest.newEntity(QuestType.PERIOD, '주 당 누적 독서 20시간', 20, 7),
    );
    const savedQuestList = await this.questRepository.save(questEntityList);
    return QuestListDto.makeRes(savedQuestList);
  }

  async getQuestList(type: QuestType): Promise<QuestListDto> {
    const questEntityList: Quest[] = await this.questRepository.find({
      where: { type: type },
    });
    return QuestListDto.makeRes(questEntityList);
  }

  async achieveQuest(
    userId: number,
    questId: number,
  ): Promise<QuestHistoryDto> {
    const questHistoryEntity: QuestHistory = QuestHistory.newEntity(
      userId,
      questId,
    );
    const quest = await this.questRepository.findOne({
      where: { questId: questId },
    });
    if (!quest) throw InvalidQuestId();

    const savedHistory =
      await this.questHistoryRepository.save(questHistoryEntity);
    await this.coinService.addCoin(userId, quest.coin);
    return QuestHistoryDto.makeRes(savedHistory);
  }

  async getWeeklyAchieveQuestList(
    userId: number,
    date: Date,
  ): Promise<QuestHistoryListDto> {
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay()); // 금주의 독서 기록을 가져오기 위하여 현재 날짜 기준 금주의 시작 날짜 가져옴

    const lastDate = new Date(startDate);
    lastDate.setDate(startDate.getDate() + 6);

    const questHistoryList = await this.questHistoryRepository.find({
      where: { userId: userId, createdAt: Between(startDate, lastDate) },
    });
    return QuestHistoryListDto.makeRes(questHistoryList);
  }
}
