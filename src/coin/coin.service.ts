import { Injectable } from '@nestjs/common';
import { Coin } from 'src/model/entity/Coin.entity';
import { CoinDto } from './dto/coin.dto';
import { CoinRepository } from './repository/coin.repository';

@Injectable()
export class CoinService {
    constructor(private readonly coinRepository: CoinRepository) { }

    async getCoin(userId: number): Promise<CoinDto> {
        const currentCoin: Coin = await this.coinRepository.findOne({
            where: { userId: userId },
        });
        return new CoinDto().setDataByUserItemEntity(currentCoin);
    }

    async createCoin(userId: number): Promise<CoinDto> {
        let coin: Coin = new Coin();
        coin.userId = userId;
        coin.totalCoin = 0;
        const currentCoin = await this.coinRepository.save(coin);
        return new CoinDto().setDataByUserItemEntity(currentCoin);
    }

    async addCoin(userId: number, addCoin: number): Promise<CoinDto> {
        const currentCoin: Coin = await this.coinRepository.plusCoin(userId, addCoin);
        return new CoinDto().setDataByUserItemEntity(currentCoin);
    }


    async useCoin(userId: number, usedCoin: number): Promise<CoinDto> {
        const remainCoin: Coin = await this.coinRepository.minusCoin(userId, usedCoin);
        return new CoinDto().setDataByUserItemEntity(remainCoin);
    }

}
