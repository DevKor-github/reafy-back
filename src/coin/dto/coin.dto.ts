import { ApiProperty } from "@nestjs/swagger";
import { Coin } from "src/model/entity/Coin.entity";
export class CoinDto {

    @ApiProperty({ description: 'user가 소유한 총 coin' })
    totalCoin: number;

    setDataByUserItemEntity = (userCoin: Coin): CoinDto => {
        this.totalCoin = userCoin.totalCoin;
        return this;
    }
}