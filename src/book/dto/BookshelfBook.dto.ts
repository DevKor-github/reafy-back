import { IsNumber, IsString } from 'class-validator';

export class BookshelfBookDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  bookId: number;

  @IsString()
  thumbnailURL: string;
}
