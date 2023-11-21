import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginRequest } from './dto/LoginRequest.dto';
import { TokenResponse } from './dto/TokenResponse.dto';
import { Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @Post('accesstokenTest')
  @UseGuards(AuthGuard('access'))
  async accesstokenTest(
    @Body() data: LoginRequest,
    @Res({ passthrough: true }) res,
    @Req() req
  ){
    console.log(req);
    console.log(req?.user);
  }

  @Post('login')
  async login(
    @Body() data: LoginRequest,
    @Res({ passthrough: true }) res,
  ): Promise<TokenResponse> {
    return this.authenticationService.login(data, res);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('refresh'))
  async refresh(@Req() req: any) {
    try {
      return await this.authenticationService.refreshJWT(
        req.user.id,
        req.user.refreshToken,
      );
    } catch (err) {
      return err;
    }
  }

}
