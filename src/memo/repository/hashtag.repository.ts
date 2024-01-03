import { Hashtag } from './../../model/entity/Hashtag.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class HashtagRepository extends Repository<Hashtag> {
  constructor(private dataSource: DataSource) {
    super(Hashtag, dataSource.createEntityManager());
  }
}
