import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SaveInBookshelfReqDto {
  @IsNumber()
  userId: number;

  @IsString()
  isbn13: string;

  @IsString()
  progressState: number;
}
