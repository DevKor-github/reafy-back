import { Injectable } from '@nestjs/common';
import { Coin } from 'src/model/entity/Coin.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CoinRepository extends Repository<Coin> {

    constructor(private readonly dataSource: DataSource) {
        super(Coin, dataSource.createEntityManager());
    }

    async plusCoin(userId: number, coin: number): Promise<Coin> {
        await this.increment({ userId: userId }, "totalCoin", coin);
        return await this.findOne({ where: { userId } });
    }
}