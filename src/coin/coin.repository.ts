import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Coin } from 'src/model/entity/Coin.entity';
import { UserItem } from 'src/model/entity/UserItem.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CoinRepository {
    private coinRepository: Repository<Coin>;

    constructor(private readonly dataSource: DataSource) {
        this.coinRepository = this.dataSource.getRepository(Coin);
    }

    async create(coin: Coin): Promise<Coin> {
        return await this.coinRepository.save(coin);
    }

    async plusCoin(userId: number, coin: number): Promise<Coin> {
        let currentCoin: Coin = await this.coinRepository.findOne({
            where: { userId: userId },
        });

        currentCoin.totalCoin += coin;
        return await this.coinRepository.save(currentCoin);
    }

    async minusCoin(userId: number, coin: number): Promise<Coin> {
        let currentCoin: Coin = await this.coinRepository.findOne({
            where: { userId: userId },
        });
        const remainCoin: number = currentCoin.totalCoin - coin;
        if (remainCoin < 0) {
            throw new InternalServerErrorException("Remain Coin is not enough.");
        }

        currentCoin.totalCoin = remainCoin;
        return await this.coinRepository.save(currentCoin);
    }

    async getUserCoin(userId: number): Promise<Coin> {
        return await this.coinRepository.findOne({
            where: { userId: userId },
        });
    }
}