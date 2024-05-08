import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BasicDate } from './BasicDate.entity';

export enum QuestType {
  PERIOD = 'P', //주기성 퀘스트
  TEMP = 'T', // 1회성 퀘스트
}

@Entity('quest')
export class Quest extends BasicDate {
  @PrimaryGeneratedColumn({ name: 'quest_id' })
  questId: number;

  @Column({ name: 'type', comment: 'P: 주기성 퀘스트, T: 1회성 퀘스트' })
  type: QuestType;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'coin' })
  coin: number;

  @Column({ name: 'period' })
  period: number;

  static newEntity(
    type: QuestType,
    description: string,
    coin: number,
    period: number,
  ) {
    const quest: Quest = new Quest();
    quest.type = type;
    quest.description = description;
    quest.coin = coin;
    quest.period = period;

    return quest;
  }
}
