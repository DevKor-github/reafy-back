import { IsNumber } from 'class-validator';

export class CreateUserBookHistoryDto {
  @IsNumber()
  bookshelfBookId: number;
  //userId : number 요청 토큰으로 받으면 됨

  @IsNumber()
  startPage: number;

  @IsNumber()
  endPage: number;

  @IsNumber()
  duration: number; //단위 s

  @IsNumber()
  coins: number; //얻은 코인 수
}
