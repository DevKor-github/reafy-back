import { IsNotEmpty, IsString } from 'class-validator';

export class SearchBookResDto {
  @IsString()
  isbn13: string;

  @IsString()
  cover: string;

  @IsString()
  title: string;

  @IsString()
  author: string;

  static async makeRes(data: any) {
    const resData: SearchBookResDto = {
      isbn13: data.isbn13,
      cover: data.cover,
      title: data.title,
      author: data.author,
    };

    return resData;
  }
}
