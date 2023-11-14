import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginRequest } from 'src/authentication/dto/LoginRequest.dto';
import { TokenResponse } from 'src/authentication/dto/TokenResponse.dto';
import { FindOptionsSelect } from 'typeorm';
import { User } from 'src/model/entity/User.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {

    constructor(
        private readonly userRepository: UserRepository,

    ) { }

    async createUser(data: User): Promise<User> {
        // 유저 닉네임, 이름 등 설정 시 해당 내용 검증
        // await this.validateUsername(data.username);

        return await this.userRepository.create({
            userId: null, // todo token에서 가져온 Id 
            oauthId: data.oauthId,
            vender: data.vender
        });
    }

    async findById(oauthId: string): Promise<User> {
        const user = this.userRepository.findUserByOauthId(oauthId);

        if (!user) throw new BadRequestException();
        return user;
    }



}
