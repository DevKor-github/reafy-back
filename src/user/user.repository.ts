import { Injectable } from '@nestjs/common';
import { User } from 'src/model/entity/User.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
    private userRepository: Repository<User>;

    constructor(private readonly dataSource: DataSource) {
        this.userRepository = this.dataSource.getRepository(User);
    }

    async create(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    async findUserByOauthId(oauthId: string): Promise<User> {
        return await this.userRepository.findOne({
            where: { oauthId: oauthId },
        });
    }

}