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
            ignoreExpiration: true, // token verify는 서버에서 진행

        });
    }

    async validate(payload) {
        try{
            const user = await this.authenticationService.tokenValidate(payload?.oauthId);
            if (!user) {
                return new UnauthorizedException();
            }
    
            return {
                oauthId: user.oauthId,
            }
        } catch(err){
            console.log(`err : ${err}}`);
        }
        
    }
}