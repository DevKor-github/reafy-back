import { Injectable } from '@nestjs/common';
import { CoinRepository } from './coin.repository';
import { CoinDto } from './dto/coin.dto';
import { Coin } from 'src/model/entity/Coin.entity';

@Injectable()
export class CoinService {
    constructor(private readonly coinRepository: CoinRepository) { }

    async getCoin(userId: number): Promise<CoinDto> {
        const currentCoin: Coin = await this.coinRepository.getUserCoin(userId);
        return new CoinDto().setDataByUserItemEntity(currentCoin);
    }

    async createCoin(userId: number): Promise<CoinDto> {
        let coin: Coin = new Coin();
        coin.userId = userId;
        coin.totalCoin = 0;
        const currentCoin = await this.coinRepository.create(coin);
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
