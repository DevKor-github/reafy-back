import { Body, Controller, Inject, LoggerService, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { User } from 'src/model/entity/User.entity';
import { AuthenticationService } from './authentication.service';
import { LoginRequest } from './dto/LoginRequest.dto';
import { TokenResponse } from './dto/TokenResponse.dto';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) { }

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
  async accesstokenTest(@Res({ passthrough: true }) res, @Req() req) {
    this.logger.log("accesstoken", JSON.stringify(req.user));
    this.logger.error("accesstoken", JSON.stringify(req.user));
    this.logger.debug("accesstoken", JSON.stringify(req.user));
    this.logger.warn("accesstoken", JSON.stringify(req.user));
    return req?.user;
  }

  @ApiOperation({
    summary: '로그인 api',
    description: 'kakao oauth로 발급 받은 accesstoken 기반 로그인',
  })
  @ApiOkResponse({
    description:
      'kakao accesstoken 기반으로 유저 생성 및 access token 생성 및 refresh token response cookie에 return',
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
    return await this.authenticationService.refreshJWT(
      req.user.oauthId,
      req.user.refreshToken,
    );
  }

  @ApiOperation({
    summary: 'logout용 api',
    description: 'logout 요청 시 refreshtoken 삭제',
  })
  @ApiOkResponse({
    description: 'logout 성공 여부 return',
    type: Boolean,
  })
  @ApiBearerAuth('accessToken')
  @Post('logout')
  @UseGuards(AuthGuard('refresh'))
  async logout(@Req() req: any): Promise<Boolean> {
    return await this.authenticationService.logout(req.user.oauthId);

  }
}
