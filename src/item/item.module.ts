import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinModule } from 'src/coin/coin.module';
import { UserItem } from 'src/model/entity/UserItem.entity';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { UserItemRepository } from './repository/userItem.repository';

@Module({
  controllers: [ItemController],
  providers: [ItemService, UserItemRepository],
  imports: [
    TypeOrmModule.forFeature([UserItem]),
    CoinModule,
  ],
})
export class ItemModule { }
