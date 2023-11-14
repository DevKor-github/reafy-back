import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginRequest } from './dto/LoginRequest.dto';
import { TokenResponse } from './dto/TokenResponse.dto';
import { Get } from '@nestjs/common';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }


  @Get('test')
  test(
    @Body() data: LoginRequest,
    @Res({ passthrough: true }) res,
  ) {
    console.log("test api");
  }

  @Post('login')
  async login(
    @Body() data: LoginRequest,
    @Res({ passthrough: true }) res,
  ): Promise<TokenResponse> {
    return this.authenticationService.login(data, res);
  }

}
