import { ApiProperty } from '@nestjs/swagger';
import { Memo } from 'src/model/entity/Memo.entity';

export class MemoResDto {
  @ApiProperty()
  memoId: number;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  bookshelfBookId: number;
  @ApiProperty()
  content: string;
  @ApiProperty()
  page: number;
  @ApiProperty()
  imageURL: string;
  @ApiProperty({ type: [String] })
  hashtag: string[];
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  static async makeRes(memoObject: Memo, hashtags: string[]) {
    const resData: MemoResDto = {
      memoId: memoObject.memoId,
      userId: memoObject.userId,
      bookshelfBookId: memoObject.bookshelfBookId,
      content: memoObject.content,
      page: memoObject.page,
      imageURL: memoObject.imageURL,
      hashtag: hashtags,
      createdAt: memoObject.createdAt,
      updatedAt: memoObject.updatedAt,
    };
    console.log(resData);
    return resData;
  } //각각의 객체에 대해서 파싱하고 Res Dto로 변환
}
