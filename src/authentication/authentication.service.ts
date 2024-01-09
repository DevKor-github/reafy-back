import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequest } from './dto/LoginRequest.dto';
import { TokenResponse } from './dto/TokenResponse.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { HttpService } from '@nestjs/axios';
import {
  ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE,
} from 'src/common/constant/authentication.constant';
import { JwtSubjectType } from 'src/common/type/authentication.type';
import { User } from 'src/model/entity/User.entity';
import axios from 'axios';
import { CoinService } from 'src/coin/coin.service';
import { InvalidLoginAccessException } from 'src/common/exception/authentication.exception';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly coinService: CoinService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async login(data: LoginRequest, res): Promise<TokenResponse> {
    try {
      let oauthId;
      switch (data.vendor) {
        case 'kakao': {
          oauthId = await this.getUserOauthIdByKakaoAccessToken(
            data.accessToken,
          );
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
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
  /*
  마찬가지로 try-catch를 삭제하는 것이 좋을 것 같다.
  글로벌 필터가 구현되어있기에 internalServerException은 자동으로 잡을 수가 있다.
  */

  async getUserOauthIdByKakaoAccessToken(accessToken: string): Promise<string> {
    // KAKAO LOGIN 회원조회 REST-API
    try {
      const user: any = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!user) throw new UnauthorizedException(); //카카오 로그인 실패 예외처리
      const kakaoId = user?.data?.id;

      const oauthId = (await this.userService.findByOauthId(kakaoId))?.oauthId;

      if (oauthId) return oauthId;

      // 회원이 없으면 회원가입 후 아이디 반환
      const createdUser: User = await this.userService.createUser({
        oauthId: kakaoId,
        vender: 'kakao',
      });

      this.coinService.createCoin(createdUser.userId);
      return createdUser.oauthId;
    } catch (err) {
      console.log(`error : ${err}`);
      throw new InternalServerErrorException();
    }
  }

  /* Review
  try-catch로 이루어져 있으므로 try 내에서 일어난 모든 에러를 catch에서 받아서 처리하게 됨.
  이 함수에서 발생 가능한 에러는 크게 두 가지.
  --
  1. 카카오 API에 axios 요청.
  잘못된 Access Token을 보내 요청할 경우, 401 에러가 발생한다.
  https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#sign-up-sample 참고

  2. userService.findByOauthId를 호출하였을 때, 해당 유저가 존재하지 않아 findByOauthId 내에서 던져지는 에러
  --
  발생가능한 오류가 여러 가지임에도, try를 쓰는 것은 좋지 않아보인다.
  각각이 모두 어떤 에러인지 판별 가능하므로, try가 아닌, 각각의 경우에 if를 통해 예외를 던지는 것이 좋을 것 같다.
  (실제로 프론트엔드에서 로그인 호출 테스트하는데 401 에러를 계속 500으로 반환하여서 에러 수정에 어려움을 겪었었음)

  첫 번째 에러 핸들링은, user.data.code == -401 인 경우에 unauthorized 예외를 던지는 것으로 하는 게 좋을듯.
  에러가 발생하였을 때,  user 객체가 반환되지 않는 것이 아니라, 에러 메세지가 담긴 객체가 반환된다.
  */
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
    if (!user) throw new UnauthorizedException('존재하지 않는 유저입니다.');
    // Review : 어차피 userService.findByOauthId에서 유저가 존재하지 않으면 예외를 던진다. 지워도 될 것 같다.

    if (user.refreshToken !== refreshToken)
      throw new UnauthorizedException('invalid refresh token');

    const accessToken = await this.generateAccessToken(user.oauthId);
    return new TokenResponse({ accessToken });
  }
}
