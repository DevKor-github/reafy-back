import { Module } from '@nestjs/common';
import { CoinController } from './coin.controller';
import { CoinService } from './coin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin } from 'src/model/entity/Coin.entity';
import { CoinRepository } from './repository/coin.repository';

@Module({
  controllers: [CoinController],
  providers: [CoinService, CoinRepository],
  imports: [TypeOrmModule.forFeature([Coin])],
  exports: [CoinService],
})
export class CoinModule { }
