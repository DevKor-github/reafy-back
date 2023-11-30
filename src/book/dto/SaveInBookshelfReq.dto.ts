import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SaveInBookshelfReqDto {
  @ApiProperty({ description: '국제 표준 도서 번호' })
  @IsString()
  isbn13: string;

  @ApiProperty({ description: '책 상태' })
  @IsString()
  progressState: number;
}
