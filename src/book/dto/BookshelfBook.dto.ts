import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BookshelfBookDto {
  @ApiProperty({ description: 'bookshelfBook_id' })
  @IsNumber()
  bookshelfBookId: number;

  @ApiProperty({ description: '책 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '책 표지 URL' })
  @IsString()
  thumbnailURL: string;

  @ApiProperty({ description: '작가 & 번역가' })
  @IsString()
  author: string;

  @ApiProperty({ description: '책 상태; 전 = 0, 중 = 1, 후 = 2' })
  @IsNumber()
  progressState: number;

  @ApiProperty({ description: '좋아하는 책' })
  @IsNumber()
  isFavorite: number;

  @ApiOperation({ description: '응답 생성 내부 함수' })
  static makeRes(data) {
    const resData: BookshelfBookDto = { ...data };
    return resData;
  }
}
