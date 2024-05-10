import { ApiProperty } from '@nestjs/swagger';
import { UserBookHistoryResDto } from './UserBookHistoryRes.dto';

class PaginatedUserBookHistoryMeta {
  @ApiProperty({ description: '마지막 레코드 커서 id' })
  cursorId: number;

  @ApiProperty({ description: '다음 페이지 존재 여부' })
  hasNextData: boolean;

  constructor(cursorId: number, hasNextData: boolean) {
    this.cursorId = cursorId;
    this.hasNextData = hasNextData;
  }
}

export class PaginatedUserBookHistoryRes {
  @ApiProperty({ type: Object, description: '유저 독서 기록 목록' })
  data: Record<string, UserBookHistoryResDto[]>;

  @ApiProperty({ description: '유저 독서 기록 메타 정보' })
  meta: PaginatedUserBookHistoryMeta;

  constructor(
    userBookHistoryList: Record<string, UserBookHistoryResDto[]>,
    cursorId: number,
    hasNextData: boolean,
  ) {
    this.data = userBookHistoryList;
    this.meta = new PaginatedUserBookHistoryMeta(cursorId, hasNextData);
  }
}
