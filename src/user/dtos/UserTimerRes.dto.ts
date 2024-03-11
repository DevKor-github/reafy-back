import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/model/entity/User.entity';

export class UserTimerResDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  timer: number;

  static makeRes(data: User) {
    const resData = new UserTimerResDto();

    resData.userId = data.userId;
    resData.timer = data.timer;

    return resData;
  }
}
