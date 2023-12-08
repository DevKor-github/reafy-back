import { IsNumber, IsString } from 'class-validator';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';

export class BookshelfBookDetailDto {
  @ApiProperty({ description: 'bookshelfBook_id' })
  @IsNumber()
  bookshelfbookId: number;

  @ApiProperty({ description: '책 상태' })
  @IsNumber()
  progressState: number;

  @ApiProperty({ description: '좋아하는 책 여부' })
  @IsNumber()
  isFavorite: number;

  @ApiProperty({ description: '책 id' })
  @IsNumber()
  bookId: number;

  @ApiProperty({ description: '책 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '책 저자 / 번역가' })
  @IsString()
  author: string;

  @ApiProperty({ description: '책 설명' })
  @IsString()
  content: string;

  @ApiProperty({ description: '출판사' })
  @IsString()
  publisher: string;

  @ApiProperty({ description: '책 표지 URL' })
  @IsString()
  thumbnailURL: string;

  @ApiProperty({ description: '알라딘 책 상세 정보 URL' })
  @IsString()
  link: string;

  @ApiProperty({ description: '책 분류' })
  @IsString()
  category: string;

  @ApiProperty({ description: '책 페이지 수' })
  @IsNumber()
  pages: number;

  @ApiProperty({ description: '읽기 시작한 페이지' })
  @IsNumber()
  startPage: number;

  @ApiProperty({ description: '지금까지 읽은 페이지' })
  @IsNumber()
  endPage: number;

  @ApiOperation({ description: '내부 응답 생성 함수' })
  static async makeRes(data, startPage, endPage) {
    const resData: BookshelfBookDetailDto = { startPage, endPage, ...data };
    return resData;
  }
}
