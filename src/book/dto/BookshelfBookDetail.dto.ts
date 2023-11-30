import { IsNumber, IsString } from 'class-validator';

export class BookshelfBookDetailDto {
  @IsNumber()
  bookshelfbookId: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  progressState: number;

  @IsNumber()
  bookId: number;

  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  content: string;

  @IsString()
  publisher: string;

  @IsString()
  thumbnailURL: string;

  @IsString()
  link: string;

  @IsString()
  category: string;

  @IsNumber()
  pages: number;

  @IsNumber()
  startPage: number;

  @IsNumber()
  endPage: number;

  static async makeRes(data, startPage, endPage) {
    const resData: BookshelfBookDetailDto = { startPage, endPage, ...data };
    return resData;
  }
}
