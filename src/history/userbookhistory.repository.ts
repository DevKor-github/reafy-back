import { Injectable } from '@nestjs/common';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class UserBookHistoryRepository extends Repository<UserBookHistory> {
  constructor(private dataSource: DataSource) {
    super(UserBookHistory, dataSource.createEntityManager());
  }
}
