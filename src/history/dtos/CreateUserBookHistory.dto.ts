import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateUserBookHistoryDto {
  @ApiProperty({ description: 'bookshelfbook_id' })
  @IsNumber()
  bookshelfBookId: number;
  //userId : number 요청 토큰으로 받으면 됨

  @ApiProperty({ description: '읽기 시작한 페이지' })
  @IsNumber()
  startPage: number;

  @ApiProperty({ description: '마지막으로 읽은 페이지' })
  @IsNumber()
  endPage: number;

  @ApiProperty({ description: '독서 시간(초 단위)' })
  @IsNumber()
  duration: number; //단위 s

  @ApiProperty({ description: '남은 타이머 시간(초 단위)' })
  @IsNumber()
  remainedTimer: number;

  //비활성화
  /*@ApiProperty({ description: '얻은 코인 수' })
  @IsNumber()
  coins: number; //얻은 코인 수*/
}
