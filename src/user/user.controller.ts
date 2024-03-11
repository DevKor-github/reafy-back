import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { Request } from 'express';
import { UserTimerResDto } from './dtos/UserTimerRes.dto';

@ApiTags('User')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('access'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '유저 타이머 불러오기',
    description:
      '유저가 지난 독서에 사용했던 타이머의 남은 시간을 가져옵니다. (초 단위) ',
  })
  @ApiOkResponse({
    description: '유저의 저장된 타이머',
    type: UserTimerResDto,
    isArray: false,
  })
  @Get('timer')
  async getUserTimer(@Req() req: Request): Promise<UserTimerResDto> {
    return await this.userService.getUserTimer(req.user.userId);
  }
}
