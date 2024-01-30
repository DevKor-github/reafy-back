
import {
  Inject,
  Injectable,
  LoggerService
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { CoinService } from 'src/coin/coin.service';
import {
  ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE,
} from 'src/common/constant/authentication.constant';
import {
  BadAccessTokenException,
  InvalidRefreshTokenException,
  VendorNotExistException,
} from 'src/common/exception/authentication.exception';
import { InternalServerException } from 'src/common/exception/base.exception';
import { JwtSubjectType } from 'src/common/type/authentication.type';
import { User } from 'src/model/entity/User.entity';
import { UserService } from 'src/user/user.service';
import { LoginRequest } from './dto/LoginRequest.dto';
import { TokenResponse } from './dto/TokenResponse.dto';
import { ErrorCodeEnum } from 'src/common/exception/error-code/error.code';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly coinService: CoinService,
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) { }

  async login(data: LoginRequest, res): Promise<TokenResponse> {
    let oauthId;
    switch (data.vendor) {
      case 'kakao': {
        oauthId = await this.getUserOauthIdByKakaoAccessToken(data.accessToken);
        break;
      }
      default: {
        this.logger.error("invalid social login");
        throw VendorNotExistException(); //소셜로그인 선택 실패 예외처리
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

  async getUserOauthIdByKakaoAccessToken(accessToken: string): Promise<string> {
    // KAKAO LOGIN 회원조회 REST-API
    let user;
    try {
      user = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (err) {
      this.logger.error(`\n## Fail to get kakao user info , accessToken : ${accessToken}`, {}, err.stack);
      if (err?.response?.data?.code === -401) throw BadAccessTokenException();
      throw InternalServerException();
    }

    const kakaoId = user?.data?.id;

    try {
      const oauthId = (await this.userService.findByOauthId(kakaoId))?.oauthId;

      if (oauthId) return oauthId;
    } catch (e) {
      if (e.errorCode.errorCode != ErrorCodeEnum.USER_NOT_FOUND) throw e; //UserNotFound error가 아닐 경우 re-throw
      // 회원이 없으면 회원가입 후 아이디 반환
      const createdUser: User = await this.userService.createUser({
        oauthId: kakaoId,
        vender: 'kakao',
      });

      this.coinService.createCoin(createdUser.userId);
      return createdUser.oauthId;
    }
  }

  protected async generateAccessToken(oauthId: string): Promise<string> {
    const payload = { oauthId: oauthId };
    return this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRE,
      subject: JwtSubjectType.ACCESS,
    });
  }

  protected async generateRefreshToken(oauthId: string): Promise<string> {
    const payload = { oauthId: oauthId };
    return this.jwtService.signAsync(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRE,
      subject: JwtSubjectType.REFRESH,
    });
  }

  async tokenValidate(oauthId: string): Promise<User> {
    return await this.userService.findByOauthId(oauthId);
  }

  async refreshJWT(id: number, refreshToken: string): Promise<TokenResponse> {
    const user = await this.userService.findByOauthId(id.toString());

    if (user.refreshToken !== refreshToken) {

      this.logger.error(`\n## Invalid refreshToken , requsrt refreshToken : ${refreshToken}, user refreshToken : ${user.refreshToken}`);
      throw InvalidRefreshTokenException();
    }

    const accessToken = await this.generateAccessToken(user.oauthId);
    return new TokenResponse({ accessToken });
  }

  async logout(id: number) {
    const user = await this.userService.findByOauthId(id.toString());
    user.refreshToken = '';
    await this.userService.updateUser(user);
    return true;
  }
}
