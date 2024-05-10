import { ApiProperty } from '@nestjs/swagger';

export class UserBookHistoryReqDto {
  @ApiProperty({ description: '책장 id', required: false })
  bookshelfBookId: number;

  @ApiProperty({ description: '커서 id', required: false })
  cursorId: number;
}
