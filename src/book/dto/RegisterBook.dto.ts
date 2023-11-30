import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
export class RegisterBookDto {
  @ApiProperty({ description: '국제 표준 도서 번호' })
  @IsString()
  isbn13: string; //책 id

  @ApiProperty({ description: '책 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '책 저자 / 번역가' })
  @IsString()
  author: string;

  @ApiProperty({ description: '책 설명' })
  @IsString()
  content: string; //책 설명

  @ApiProperty({ description: '출판사' })
  @IsString()
  publisher: string;

  @ApiProperty({ description: '책 페이지 수' })
  @IsNumber()
  pages: number;

  @ApiProperty({ description: '책 분류' })
  @IsString()
  category: string;

  @ApiProperty({ description: '책 표지 URL' })
  @IsString()
  thumbnailURL: string;

  @ApiProperty({ description: '알라딘 책 상세 정보 URL' })
  @IsString()
  link: string;

  @ApiOperation({ description: '내부 응답 생성 함수' })
  static async makeDto(data: any) {
    const dtoData: RegisterBookDto = {
      isbn13: data.isbn13,
      title: data.title,
      author: data.author,
      content: data.description,
      publisher: data.publisher,
      pages: data.subInfo.itemPage,
      category: data.categoryName,
      thumbnailURL: data.cover,
      link: data.link,
    };
    return dtoData;
  }
}
