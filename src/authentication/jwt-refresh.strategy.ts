import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ACCESS_TOKEN_EXPIRE, JWT_SECRET_KEY } from "src/common/constant/authentication.constant";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "refresh") {

    constructor(private readonly authenticationService: AuthenticationService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    console.log(req);
                    console.log(req?.cookies);
                    console.log(req?.cookies['refreshToken']);
                    return req?.cookies['refreshToken'];
    
                }

            ]),
            secretOrKey: JWT_SECRET_KEY,

        });
    }

    // validate(payload) {

    //     return {
    //         oauthId: payload?.oauthId,
    //     }
    // }

    async validate(req, payload) {
        const refreshToken = req.get('authorization').split('Bearer ')[1];

        return {
            ...payload,
            refreshToken,
        };
    }
}