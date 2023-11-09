import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SaveInBookshelfDto {
  @IsNumber()
  userId: number;

  @IsString()
  isbn13: string;
}
