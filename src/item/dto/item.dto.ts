import { ApiProperty } from "@nestjs/swagger";
import { UserItem } from "src/model/entity/UserItem.entity";

export class ItemDto {

    @ApiProperty({ description: 'user가 소유한 item id' })
    itemId: number;


    @ApiProperty({ description: '해당 item 사용 여부' })
    activation: boolean;

    setDataByUserItemEntity = (userItem: UserItem): ItemDto => {
        this.itemId = userItem.itemId;
        this.activation = userItem.activation;
        return this;
    }
}