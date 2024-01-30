import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';

export class UserBookHistoryResDto {
  @ApiProperty({ description: 'user_book_history_id' })
  @IsNumber()
  userBookHistoryId: number;

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
  duration: number;

  static makeRes(data: UserBookHistory) {
    const resData = new UserBookHistoryResDto();
    resData.userBookHistoryId = data.userBookHistoryId;
    resData.bookshelfBookId = data.bookshelfBookId;
    resData.startPage = data.startPage;
    resData.endPage = data.endPage;
    resData.duration = data.duration;

    return resData;
  }
}
