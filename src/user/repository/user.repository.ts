import { Injectable } from '@nestjs/common';
import { User } from 'src/model/entity/User.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  private userRepository: Repository<User>;

  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async saveUserTimer(userId: number, timer: number) {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });
    user.timer = timer;
    return await this.userRepository.save(user);
  }
}
