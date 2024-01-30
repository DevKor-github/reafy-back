import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NotEnoughCoinException } from 'src/common/exception/coin-service.exception';
import { Coin } from 'src/model/entity/Coin.entity';
import { CoinDto } from './dto/coin.dto';
import { CoinRepository } from './repository/coin.repository';

@Injectable()
export class CoinService {
    constructor(private readonly coinRepository: CoinRepository,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) { }

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
        this.logger.log(`## Get coin userId : ${userId}, addCoin : ${addCoin}`);
        const currentCoin: Coin = await this.coinRepository.plusCoin(userId, addCoin);
        return new CoinDto().setDataByUserItemEntity(currentCoin);
    }


    async useCoin(userId: number, usedCoin: number): Promise<CoinDto> {
        this.logger.log(`## Use coin userId : ${userId}, usedCoin : ${usedCoin}`);
        const remainCoin: Coin = await this.minusCoin(userId, usedCoin);
        return new CoinDto().setDataByUserItemEntity(remainCoin);
    }

    async minusCoin(userId, coin): Promise<Coin> {
        let currentCoin: Coin = await this.coinRepository.findOne({
            where: { userId: userId },
        });

        const remainCoin: number = currentCoin.totalCoin - coin;
        if (remainCoin < 0) {
            this.logger.error(`## Not enough coin userId : ${userId}, remainCoin : ${remainCoin}`);
            throw NotEnoughCoinException();
        }

        currentCoin.totalCoin = remainCoin;
        return await this.coinRepository.save(currentCoin);
    }

}
