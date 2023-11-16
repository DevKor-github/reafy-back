import { IsNotEmpty, IsString } from 'class-validator';

export class SearchBookDto {
  @IsString()
  isbn13: string;

  @IsString()
  cover: string;

  @IsString()
  title: string;

  @IsString()
  author: string;
}
