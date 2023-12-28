import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoinDto } from './dto/coin.dto';
import { CoinService } from './coin.service';
import { CoinReqDto } from './dto/coinReq.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags("Coin")
@UseGuards(AuthGuard('access'))
@Controller('coin')
export class CoinController {

    constructor(private readonly coinService: CoinService) { }

    @ApiOperation({
        summary: 'coin api',
        description: 'user가 소유하고 있는 현재 coin 가져오는 api',
    })
    @ApiOkResponse({
        description: 'user가 현재 소유하고 있는 coin',
        type: CoinDto,
    })
    @ApiBearerAuth('accessToken')
    @Get("")
    async getCoin(
        @Req() req,
    ): Promise<CoinDto> {
        console.log(req.user)
        const userId = req.user.userId;
        return await this.coinService.getCoin(userId);
    }


    @ApiOperation({
        summary: 'coin api',
        description: 'coin 차감 혹은 증가 api',
    })
    @ApiOkResponse({
        description: 'user 소유하고 있는 item list return',
        type: CoinDto,
    })
    @ApiBearerAuth('accessToken')
    @Put("")
    async updateCoin(
        @Req() req,
        @Body() coinReqDto: CoinReqDto,
    ): Promise<CoinDto> {
        const userId = req.user.userId;

        let updatedCoin;
        if (coinReqDto.isPlus) {
            updatedCoin = this.coinService.addCoin(userId, coinReqDto.coin);
        } else {
            updatedCoin = this.coinService.useCoin(userId, coinReqDto.coin);
        }

        return updatedCoin;
    }


}
