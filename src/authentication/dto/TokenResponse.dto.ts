export class TokenResponse {
    private accessToken!: string;

    constructor(data) {
        this.accessToken = data.accessToken;
    }
}