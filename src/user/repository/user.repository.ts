import { Injectable } from '@nestjs/common';
import { User } from 'src/model/entity/User.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async saveUserTimer(userId: number, timer: number) {
    const user = await this.findOne({
      where: { userId: userId },
    });
    user.timer = timer;
    console.log(user);
    return await this.save(user);
  }
}
