import { IsNumber, IsString } from 'class-validator';

export class BookshelfBookDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  bookshelfBookId: number;

  @IsString()
  title: string;

  @IsString()
  thumbnailURL: string;

  @IsNumber()
  progressState: number;

  static async makeRes(data) {
    const resData: BookshelfBookDto = { ...data };
    return resData;
  }
}
