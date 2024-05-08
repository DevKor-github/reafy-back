import { ApiProperty } from '@nestjs/swagger';

export class UserBookHistoryReqDto {
  @ApiProperty({ required: false })
  bookshelfBookId: number;

  @ApiProperty({ required: false })
  cursorId: number;
}
