import { Injectable } from '@nestjs/common';
import { User } from 'src/model/entity/User.entity';
import { UserItem } from 'src/model/entity/UserItem.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserItemRepository {
    private userItemRepository: Repository<UserItem>;

    constructor(private readonly dataSource: DataSource) {
        this.userItemRepository = this.dataSource.getRepository(UserItem);
    }

    async create(userItem: UserItem): Promise<UserItem> {
        return await this.userItemRepository.save(userItem);
    }

    async getUserItem(userId: number, itemId: number): Promise<UserItem> {
        return await this.userItemRepository.findOne({
            where: { userId: userId, itemId: itemId },
        });
    }

    
    async getUserItemList(userId: number): Promise<UserItem[]> {
        return await this.userItemRepository.find({
            where: { userId: userId },
        });
    }

}