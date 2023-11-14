
type TokenResponseData = { accessToken: string; isFreshman?: boolean };

export class TokenResponse {
    private accessToken!: string;
    private isFreshman?: boolean;

    constructor(data: TokenResponseData) {
        this.accessToken = data.accessToken;
        this.isFreshman = data.isFreshman || true;
    }
}