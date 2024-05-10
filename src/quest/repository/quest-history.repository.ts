import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { QuestHistory } from '../../model/entity/QuestHistory.entity';

@Injectable()
export class QuestHistoryRepository extends Repository<QuestHistory> {
  constructor(private readonly dataSource: DataSource) {
    super(QuestHistory, dataSource.createEntityManager());
  }
}
