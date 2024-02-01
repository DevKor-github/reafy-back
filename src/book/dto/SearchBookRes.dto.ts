import { IsNotEmpty, IsString } from 'class-validator';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
export class SearchBookResDto {
  @ApiProperty({ description: '국제 표준 도서 번호' })
  @IsString()
  isbn13: string;

  @ApiProperty({ description: '책 표지 URL' })
  @IsString()
  thumbnailURL: string;

  @ApiProperty({ description: '책 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '책 저자 / 번역가' })
  @IsString()
  author: string;

  @ApiOperation({ description: '내부 응답 생성 함수' })
  static async makeRes(data: any) {
    const resData: SearchBookResDto = {
      isbn13: data.isbn13,
      thumbnailURL: data.cover,
      title: data.title,
      author: data.author,
    };

    return resData;
  }
}

export class SearchBookResWithPagesDto {
  @ApiProperty({ description: '해당 검색의 총 결과 수' })
  totalResults: number;

  @ApiProperty({ description: '현재 페이지의 아이템 수' })
  itemPerPage: number;

  @ApiProperty({ description: '해당 검색의 총 페이지 수' })
  totalPages: number;

  @ApiProperty({ description: '현재 조회한 페이지' })
  currentPage: number;

  @ApiProperty({ description: '현재 페이지의 아이템 목록' })
  item: SearchBookResDto[];
}
