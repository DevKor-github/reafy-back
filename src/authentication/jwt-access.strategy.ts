import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_TOKEN_EXPIRE } from 'src/common/constant/authentication.constant';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(private readonly authenticationService: AuthenticationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: false, // token verify는 서버에서 진행
    });
  }

  async validate(payload) {
    try {
      const user = await this.authenticationService.tokenValidate(
        payload?.oauthId,
      );
      if (!user) {
        return new UnauthorizedException();
      } //Review : userService.findByUserOauthId에서 유저를 찾지 못한다면 예외를 던진다. 지워도 될 것 같다.

      return {
        oauthId: user.oauthId,
        userId: user.userId,
      };
    } catch (err) {
      console.log(`err : ${err}}`);
    } // try-catch는 마찬가지로 지우는 게 나을 듯.
  }
}
