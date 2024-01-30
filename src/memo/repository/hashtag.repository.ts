import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Hashtag } from './../../model/entity/Hashtag.entity';

@Injectable()
export class HashtagRepository extends Repository<Hashtag> {
  constructor(private readonly dataSource: DataSource) {
    super(Hashtag, dataSource.createEntityManager());
  }
}
