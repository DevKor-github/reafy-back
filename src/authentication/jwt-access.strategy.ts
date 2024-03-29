import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
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
    const user = await this.authenticationService.tokenValidate(
      payload?.oauthId,
    );

    return {
      oauthId: user.oauthId,
      userId: user.userId,
    };
  }
}
