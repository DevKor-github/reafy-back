import { Injectable } from '@nestjs/common';
import { UserItemRepository } from './userItem.repository';
import { UserItem } from 'src/model/entity/UserItem.entity';
import { Repository } from 'typeorm';
import { ItemDto } from './dto/item.dto';

@Injectable()
export class ItemService {
    constructor(
        private readonly userItemRepository: UserItemRepository,

    ) { }

    async getItemList(userId: number): Promise<ItemDto[]> {
        const userItemList = await this.userItemRepository.getUserItemList(userId);

        let itemDtoList: Array<ItemDto> = [];

        userItemList?.forEach((userItem: UserItem) => {
            const itemDto = new ItemDto().setDataByUserItemEntity(userItem);
            itemDtoList.push(itemDto);
        })

        return itemDtoList;

    }

    async buyItem(userId: number, itemDto: ItemDto): Promise<ItemDto> {
        let requestItem: UserItem = this.toUserItemEntity(itemDto, userId); // todo activation ture of false ?

        let item: UserItem = await this.userItemRepository.getUserItem(userId, itemDto.itemId);
        if (item) {
            item.activation = itemDto.activation;
            requestItem = item;
        }

        const savedItem = await this.userItemRepository.create(requestItem);
        return new ItemDto().setDataByUserItemEntity(savedItem);
    }

    toUserItemEntity = (userItem: ItemDto, userId: number): UserItem => {
        const newUserItem = new UserItem();
        newUserItem.userId = userId;
        newUserItem.itemId = userItem.itemId;
        newUserItem.activation = userItem.activation;

        return newUserItem;
    }

}

