import { Injectable } from '@nestjs/common';
import { User } from 'src/model/entity/User.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
    private userRepository: Repository<User>;

    constructor(private readonly dataSource: DataSource) {
        super(User, dataSource.createEntityManager())
    }
}