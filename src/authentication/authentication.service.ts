import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequest } from './dto/LoginRequest.dto';
import { TokenResponse } from './dto/TokenResponse.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { HttpService } from '@nestjs/axios';
import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from 'src/common/constant/authentication.constant';
import { JwtSubjectType } from 'src/common/type/authentication.type';
import { User } from 'src/model/entity/User.entity';
import axios from 'axios';



@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly httpService: HttpService,
    ) { }

    async login(data: LoginRequest, res): Promise<TokenResponse> {
        try{
            let oauthId;
            switch (data.vendor) {
                case 'kakao': {
                    oauthId = await this.getUserOauthIdByKakaoAccessToken(data.accessToken);
                    break;
                }
                default: {
                    throw new BadRequestException(); //소셜로그인 선택 실패 예외처리
                }
            }
    
            // accessToken, refreshToken 발급
            const [accessToken, refreshToken] = await Promise.all([
                this.generateAccessToken(oauthId),
                this.generateRefreshToken(oauthId),
            ]);
    
            res.cookie('refresh_token', refreshToken, {
                path: '/auth',
                httpOnly: true,
            });
    
            const user = await this.userService.findByOauthId(oauthId);
    
            this.userService.updateUser({ ...user, refreshToken: refreshToken });
    
            return new TokenResponse({ accessToken });
        }
        catch(err){
            throw new BadRequestException;
        }
    }

    async getUserOauthIdByKakaoAccessToken(accessToken: string): Promise<string> {
        // KAKAO LOGIN 회원조회 REST-API
        try {
            const user: any = await axios.get('https://kapi.kakao.com/v2/user/me',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });

            if (!user) throw new UnauthorizedException(); //카카오 로그인 실패 예외처리
            const kakaoId = user?.data?.id;

            const oauthId = (await this.userService.findByOauthId(kakaoId))?.oauthId;

            if (oauthId) return oauthId;
            return (await this.userService.createUser({ userId: null, oauthId: kakaoId, vender: "kakao", refreshToken: null })).oauthId; // 회원이 없으면 회원가입 후 아이디 반환

        } catch (err) {
            console.log(`error : ${err}`);
            throw new BadRequestException;
        }
    }

    protected async generateAccessToken(oauthId: string): Promise<string> {
        const payload = { oauthId: oauthId };
        return this.jwtService.signAsync(
            payload,
            {
                expiresIn: ACCESS_TOKEN_EXPIRE,
                subject: JwtSubjectType.ACCESS,
            },
        );
    }

    protected async generateRefreshToken(oauthId: string): Promise<string> {
        const payload = { oauthId: oauthId };
        return this.jwtService.signAsync(
            payload,
            {
                expiresIn: REFRESH_TOKEN_EXPIRE,
                subject: JwtSubjectType.REFRESH,
            },
        );
    }

    async tokenValidate(oauthId: string): Promise<User> {
        return await this.userService.findByOauthId(oauthId);
    }

    async refreshJWT(id: number, refreshToken: string): Promise<TokenResponse> {
        const user = await this.userService.findByOauthId(id.toString());
        if (!user) throw new UnauthorizedException('존재하지 않는 유저입니다.');

        if (user.refreshToken !== refreshToken)
            throw new UnauthorizedException('invalid refresh token');

        const accessToken = await this.generateAccessToken(user.oauthId);
        return new TokenResponse({ accessToken });
    }


}
