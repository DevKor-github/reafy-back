import { Injectable } from '@nestjs/common';
import { User } from 'src/model/entity/User.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UserNotFoundException } from 'src/common/exception/user-service.exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async createUser(data: CreateUserDto): Promise<User> {
    // 유저 닉네임, 이름 등 설정 시 해당 내용 검증
    // await this.validateUsername(data.username);
    const newUser = new User();
    newUser.oauthId = data.oauthId;
    newUser.vender = data.vender;

    await this.userRepository.create(newUser);
    return newUser;
  }
  async updateUser(data: User): Promise<User> {
    // 유저 닉네임, 이름 등 설정 시 해당 내용 검증
    // await this.validateUsername(data.username);

    if (!data.oauthId || !data.userId) throw UserNotFoundException();

    return await this.userRepository.create(data);
  }

  async findByOauthId(oauthId: string): Promise<User> {
    const user = this.userRepository.findUserByOauthId(oauthId);

    if (!user) throw UserNotFoundException();
    return user;
  }
}
