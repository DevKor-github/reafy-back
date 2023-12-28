import { Injectable } from '@nestjs/common';
import { UserItemRepository } from './userItem.repository';
import { UserItem } from 'src/model/entity/UserItem.entity';
import { Repository } from 'typeorm';
import { ItemDto } from './dto/item.dto';
import { ItemReqDto } from './dto/itemReq.dto';
import { CoinService } from 'src/coin/coin.service';

@Injectable()
export class ItemService {
    constructor(
        private readonly userItemRepository: UserItemRepository,
        private readonly coinService: CoinService,

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

    async buyItem(userId: number, itemReqDto: ItemReqDto): Promise<ItemDto> {
        let requestItem: UserItem = this.toUserItemEntity(itemReqDto, userId); // todo activation ture of false ?

        let item: UserItem = await this.userItemRepository.getUserItem(userId, itemReqDto.itemId);
        if (item) {
            item.activation = itemReqDto.activation;
            requestItem = item;
        }

        await this.coinService.useCoin(userId, itemReqDto.price);
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

