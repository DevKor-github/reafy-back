import { ApiProperty } from '@nestjs/swagger';
import { UserBookHistoryResDto } from './UserBookHistoryRes.dto';

class PaginatedUserBookHistoryMeta {
  @ApiProperty()
  cursorId: number;

  @ApiProperty()
  hasNextData: boolean;

  constructor(cursorId: number, hasNextData: boolean) {
    this.cursorId = cursorId;
    this.hasNextData = hasNextData;
  }
}

export class PaginatedUserBookHistoryRes {
  @ApiProperty({ type: Object })
  data: Record<string, UserBookHistoryResDto[]>;

  @ApiProperty()
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
