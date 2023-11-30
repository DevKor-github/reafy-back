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
