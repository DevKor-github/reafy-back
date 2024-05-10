import { ApiProperty } from '@nestjs/swagger';
import { Quest, QuestType } from '../../model/entity/Quest.entity';
import { QuestHistory } from '../../model/entity/QuestHistory.entity';

export class QuestDto {
  @ApiProperty({ description: '퀘스트 id' })
  questId: number;

  @ApiProperty({ description: '퀘스트 타입' })
  type: QuestType;

  @ApiProperty({ description: '퀘스트 설명' })
  description: string;

  @ApiProperty({ description: '퀘스트 획득 coin' })
  coin: number;

  @ApiProperty({ description: '퀘스트 반복 주기' })
  period: number;

  static makeRes(questEntity: Quest) {
    const resData = new QuestDto();
    resData.questId = questEntity.questId;
    resData.type = questEntity.type;
    resData.description = questEntity.description;
    resData.coin = questEntity.coin;
    resData.period = questEntity.period;
    return resData;
  }
}

export class QuestListDto {
  @ApiProperty({ description: '퀘스트 리스트' })
  questList: QuestDto[];
  static makeRes(questEntityList: Quest[]) {
    const resData = new QuestListDto();
    resData.questList = questEntityList.map(QuestDto.makeRes);
    return resData;
  }
}

export class QuestHistoryDto {
  @ApiProperty({ description: '퀘스트 히스토리 id' })
  questHistoryId: number;

  @ApiProperty({ description: '퀘스트 id' })
  questId: number;

  @ApiProperty({ description: '달성 시각' })
  createdAt: Date;

  static makeRes(questHistory: QuestHistory) {
    const resData = new QuestHistoryDto();
    resData.questHistoryId = questHistory.questHistoryId;
    resData.questId = questHistory.questId;
    resData.createdAt = questHistory.createdAt;
    return resData;
  }
}

export class QuestHistoryListDto {
  @ApiProperty({ description: '퀘스트 히스토리 리스트' })
  questHistoryList: QuestHistoryDto[];

  static makeRes(questHistoryEntityList: QuestHistory[]) {
    const resData = new QuestHistoryListDto();
    resData.questHistoryList = questHistoryEntityList.map(
      QuestHistoryDto.makeRes,
    );
    return resData;
  }
}
