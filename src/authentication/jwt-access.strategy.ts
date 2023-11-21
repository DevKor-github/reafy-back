import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ACCESS_TOKEN_EXPIRE, JWT_SECRET_KEY } from "src/common/constant/authentication.constant";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, "access") {

    constructor(private readonly authenticationService: AuthenticationService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET_KEY,

        });
    }

    async validate(payload) {
        console.log("this.validate", payload);
        const user = await this.authenticationService.tokenValidate(payload);

        console.log(`user : ${user}`);

        if (!user) {
            return new UnauthorizedException();
        }

        return {
            oauthId: user.oauthId,
        }
    }
}