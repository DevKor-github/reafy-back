import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "refresh") {

    constructor(private readonly authenticationService: AuthenticationService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY,
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