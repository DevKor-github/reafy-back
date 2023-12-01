import { AccessTokenPayload } from 'src/authentication/dto/AccessToken.payload';
declare global {
  namespace Express {
    export interface User extends AccessTokenPayload {}
  }
}
