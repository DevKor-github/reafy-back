import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Quest } from '../../model/entity/Quest.entity';

@Injectable()
export class QuestRepository extends Repository<Quest> {
  constructor(private readonly dataSource: DataSource) {
    super(Quest, dataSource.createEntityManager());
  }
}
