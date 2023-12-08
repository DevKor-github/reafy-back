import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginRequest } from 'src/authentication/dto/LoginRequest.dto';
import { TokenResponse } from 'src/authentication/dto/TokenResponse.dto';
import { FindOptionsSelect, Repository } from 'typeorm';
import { User } from 'src/model/entity/User.entity';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from 'src/model/entity/Coin.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(Coin) private readonly coinRepository: Repository<Coin>,
  ) {}

  async createUser(data: User): Promise<User> {
    // 유저 닉네임, 이름 등 설정 시 해당 내용 검증
    // await this.validateUsername(data.username);

    const newUser = await this.userRepository.create({
      userId: null, // todo token에서 가져온 Id
      oauthId: data.oauthId,
      vender: data.vender,
      refreshToken: null,
    });

    await this.coinRepository.save({ userId: newUser.userId });

    return newUser;
  }
  async updateUser(data: User): Promise<User> {
    // 유저 닉네임, 이름 등 설정 시 해당 내용 검증
    // await this.validateUsername(data.username);

    if (!data.oauthId || !data.userId) throw new BadRequestException();

    return await this.userRepository.create(data);
  }

  async findByOauthId(oauthId: string): Promise<User> {
    const user = this.userRepository.findUserByOauthId(oauthId);

    if (!user) throw new BadRequestException();
    return user;
  }
}
