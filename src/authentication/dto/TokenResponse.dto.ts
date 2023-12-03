import { ApiProperty } from "@nestjs/swagger";

export class TokenResponse {

    @ApiProperty({ description: '발급된 accessToken' })
    private accessToken!: string;

    constructor(data) {
        this.accessToken = data.accessToken;
    }
}