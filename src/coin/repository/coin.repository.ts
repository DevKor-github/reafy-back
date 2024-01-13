import { Injectable } from '@nestjs/common';
import { InternalServerException } from 'src/common/exception/base.exception';
import { Coin } from 'src/model/entity/Coin.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CoinRepository extends Repository<Coin> {

    constructor(private readonly dataSource: DataSource) {
        super(Coin, dataSource.createEntityManager());
    }

    async plusCoin(userId: number, coin: number): Promise<Coin> {
        await this.increment({ userId: userId }, "totalCoin", coin);
        return await this.findOne({where : { userId: userId }});
    }

    async minusCoin(userId: number, coin: number): Promise<Coin> {
        let currentCoin: Coin = await this.findOne({
            where: { userId: userId },
        });
        const remainCoin: number = currentCoin.totalCoin - coin;
        if (remainCoin < 0) {
            throw InternalServerException("Remain Coin is not enough.");
        }

        currentCoin.totalCoin = remainCoin;
        return await this.save(currentCoin);
    }
}