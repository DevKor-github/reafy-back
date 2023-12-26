import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/entity/User.entity';
import { UserRepository } from './user.repository';
import { Coin } from 'src/model/entity/Coin.entity';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [TypeOrmModule.forFeature([User, Coin])],
  exports: [UserService],
})
export class UserModule {}
