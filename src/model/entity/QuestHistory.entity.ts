import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BasicDate } from './BasicDate.entity';

@Entity('quest_history')
export class QuestHistory extends BasicDate {
  @PrimaryGeneratedColumn({ name: 'quest_history_id' })
  questHistoryId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'quest_id' })
  questId: number;

  static newEntity(userId: number, questId: number) {
    const questHistory: QuestHistory = new QuestHistory();
    questHistory.userId = userId;
    questHistory.questId = questId;
    return questHistory;
  }
}
