import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ACCESS_TOKEN_EXPIRE, JWT_SECRET_KEY } from "src/common/constant/authentication.constant";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "refresh") {

    constructor(private readonly authenticationService: AuthenticationService) {
        super({
            // cookie-parser로 cookie에 저장하는 방식
            // jwtFromRequest: ExtractJwt.fromExtractors([
            //     (req) => {        
            //         return req?.cookies['refreshToken'];
            //     }
            // ]),

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET_KEY,
            ignoreExpiration: false, // token verify는 서버에서 진행
            passReqToCallback: true,

        });
    }

    async validate(req, payload) {
        const refreshToken = req.get('authorization').split('Bearer ')[1];
        return {
            ...payload,
            refreshToken,
        };
    }
}