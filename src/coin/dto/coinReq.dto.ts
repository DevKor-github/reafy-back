import { ApiProperty } from "@nestjs/swagger";
export class CoinReqDto {

    @ApiProperty({ description: 'update 할 coin' })
    coin: number;

    @ApiProperty({ description: 'plus 혹은 minus 여부' })
    isPlus: boolean;
}