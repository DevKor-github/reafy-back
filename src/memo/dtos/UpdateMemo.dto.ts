import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemoDto {
  @ApiProperty()
  content: string;
  @ApiProperty()
  page: number;
  @ApiProperty({ required: false })
  hashtag: string; //묶어서 줄 수 있나? ("경영,경제,자기계발") 이런 식.. 받을 때도 ,로 구분된 형태로 줘야 한다..
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: any;
}
