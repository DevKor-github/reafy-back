import { ApiProperty } from "@nestjs/swagger";

export class LoginRequest {

    @ApiProperty({ description: 'oauth 로그인 access token' })
    accessToken: string;

    @ApiProperty({ description: 'oauth vender 사 e.g. kakao'})
    vendor: string;
}