import { Injectable } from '@nestjs/common';
import { UserItem } from 'src/model/entity/UserItem.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserItemRepository extends Repository<UserItem> {
    constructor(private readonly dataSource: DataSource) {
        super(UserItem, dataSource.createEntityManager());
    }
}