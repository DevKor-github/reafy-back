import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from 'src/common/exception/user-service.exception';
import { User } from 'src/model/entity/User.entity';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async createUser(data: CreateUserDto): Promise<User> {
    // 유저 닉네임, 이름 등 설정 시 해당 내용 검증
    // await this.validateUsername(data.username);
    const newUser = new User();
    newUser.oauthId = data.oauthId;
    newUser.vender = data.vender;

    await this.userRepository.save(newUser);
    return newUser;
  }
  async updateUser(data: User): Promise<User> {
    // 유저 닉네임, 이름 등 설정 시 해당 내용 검증
    // await this.validateUsername(data.username);

    if (!data.oauthId || !data.userId) throw UserNotFoundException();

    return await this.userRepository.save(data);
  }

  async findByOauthId(oauthId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { oauthId: oauthId },
    });

    if (!user) throw UserNotFoundException();
    return user;
  }
}
