import { ApiProperty } from "@nestjs/swagger";
import { UserItem } from "src/model/entity/UserItem.entity";
import { ItemDto } from "./item.dto";

export class ItemReqDto extends ItemDto {

    @ApiProperty({ description: 'item의 가격' })
    price: number;
}