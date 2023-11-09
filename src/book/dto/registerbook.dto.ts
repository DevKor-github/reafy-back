import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class RegisterBookDto {
  @IsString()
  isbn13: string; //책 id

  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  content: string; //책 설명

  @IsString()
  publisher: string;

  @IsNumber()
  pages: number;

  @IsString()
  category: string;

  @IsString()
  thumbnailURL: string;

  @IsString()
  link: string;
}
