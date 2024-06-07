import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { formatInTimeZone } from 'date-fns-tz';

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

  @ApiProperty({ description: '독서 기록 생성일' })
  createdAt: string;

  @ApiProperty({ description: '독서 시간(초 단위)' })
  @IsNumber()
  duration: number;

  static makeRes(data?: UserBookHistory) {
    if (!data) return new UserBookHistoryResDto();
    const resData = new UserBookHistoryResDto();
    resData.userBookHistoryId = data.userBookHistoryId;
    resData.bookshelfBookId = data.bookshelfBookId;
    resData.startPage = data.startPage;
    resData.endPage = data.endPage;
    resData.duration = data.duration;
    resData.createdAt = formatInTimeZone(
      data.createdAt,
      'Asia/Seoul',
      'aaaa h시 m분',
      { locale: ko },
    );

    return resData;
  }
}
