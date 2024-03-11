import { UserTimerResDto } from './dtos/UserTimerRes.dto';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UserNotFoundException } from 'src/common/exception/user-service.exception';
import { User } from 'src/model/entity/User.entity';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    // 유저 닉네임, 이름 등 설정 시 해당 내용 검증
    // await this.validateUsername(data.username);
    const newUser = new User();
    newUser.oauthId = data.oauthId;
    newUser.vender = data.vender;
    this.logger.log('## Create new user', JSON.stringify(newUser));

    await this.userRepository.save(newUser);
    return newUser;
  }
  async updateUser(data: User): Promise<User> {
    // 유저 닉네임, 이름 등 설정 시 해당 내용 검증
    // await this.validateUsername(data.username);

    if (!data.oauthId || !data.userId) {
      this.logger.error('## user is not exist', JSON.stringify(data));
      throw UserNotFoundException();
    }

    return await this.userRepository.save(data);
  }

  async findByOauthId(oauthId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { oauthId: oauthId },
    });

    if (!user) {
      this.logger.error(`## user is not exist oauthId : ${oauthId}`);
      throw UserNotFoundException();
    }
    return user;
  }

  async getUserTimer(userId: number) {
    return UserTimerResDto.makeRes(
      await this.userRepository.findOne({ where: { userId: userId } }),
    );
  }
}
