import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginRequest } from './dto/LoginRequest.dto';
import { TokenResponse } from './dto/TokenResponse.dto';
import { Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/model/entity/User.entity';


@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @ApiOperation({
    summary: '인증 테스트 api',
    description: '발급 받은 accesstoken의 유효성을 체크',
  })
  @ApiOkResponse({
    description: 'accesstoken에 저장된 정보 기반으로 user 정보 return',
    type: User,
  })
  @ApiBearerAuth('accessToken')
  @Post('accesstokenTest')
  @UseGuards(AuthGuard('access'))
  async accesstokenTest(
    @Res({ passthrough: true }) res,
    @Req() req
  ) {
    return req?.user;
  }

  @ApiOperation({
    summary: '로그인 api',
    description: 'kakao oauth로 발급 받은 accesstoken 기반 로그인',
  })
  @ApiOkResponse({
    description: 'kakao accesstoken 기반으로 유저 생성 및 access token 생성 및 refresh token response cookie에 return',
    type: TokenResponse,
  })
  @Post('login')
  async login(
    @Body() data: LoginRequest,
    @Res({ passthrough: true }) res,
  ): Promise<TokenResponse> {
    return this.authenticationService.login(data, res);
  }
  

  @ApiOperation({
    summary: 'accesstoken 재발급 api',
    description: 'accesstoken 만료 시 refresh token 기반 access token 재발급',
  })
  @ApiOkResponse({
    description: '재발급된 accesstoken return',
    type: TokenResponse,
  })
  @ApiBearerAuth('refreshToken')
  @Post('refresh')
  @UseGuards(AuthGuard('refresh'))
  async refresh(@Req() req: any): Promise<TokenResponse> {
    try {
      return await this.authenticationService.refreshJWT(
        req.user.oauthId,
        req.user.refreshToken,
      );
    } catch (err) {
      return err;
    }
  }

}
