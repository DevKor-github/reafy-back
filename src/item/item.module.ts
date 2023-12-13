import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { UserItemRepository } from './userItem.repository';
import { UserItem } from 'src/model/entity/UserItem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ItemController],
  providers: [ItemService, UserItemRepository],
  imports: [TypeOrmModule.forFeature([UserItem])],
})
export class ItemModule {}
