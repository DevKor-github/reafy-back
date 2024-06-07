import { ApiProperty } from '@nestjs/swagger';
import { Memo } from 'src/model/entity/Memo.entity';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

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
  createdAt: string;
  @ApiProperty()
  updatedAt: string;

  static async makeRes(memoObject: Memo, hashtags: string[]) {
    const resData: MemoResDto = {
      memoId: memoObject.memoId,
      userId: memoObject.userId,
      bookshelfBookId: memoObject.bookshelfBookId,
      content: memoObject.content,
      page: memoObject.page,
      imageURL: memoObject.imageURL,
      hashtag: hashtags,
      createdAt: formatInTimeZone(
        memoObject.createdAt,
        'Asia/Seoul',
        'yyyy.MM.dd HH:mm',
      ),
      updatedAt: formatInTimeZone(
        memoObject.updatedAt,
        'Asia/Seoul',
        'yyyy.MM.dd HH:mm',
      ),
    };
    return resData;
  } //각각의 객체에 대해서 파싱하고 Res Dto로 변환
}

export class MemoResWithPagesDto {
  @ApiProperty({ description: '해당 검색의 총 결과 수' })
  totalItems: number;

  @ApiProperty({ description: '현재 페이지의 아이템 수' })
  currentItems: number;

  @ApiProperty({ description: '해당 검색의 총 페이지 수' })
  totalPages: number;

  @ApiProperty({ description: '현재 조회한 페이지' })
  currentPage: number;

  @ApiProperty({ description: '현재 페이지의 아이템 목록' })
  item: MemoResDto[];

  static makeRes(
    totalResults: number,
    currentResults: number,
    currentPage: number,
    item: MemoResDto[],
  ) {
    const resData: MemoResWithPagesDto = {
      totalItems: totalResults,
      currentItems: currentResults,
      totalPages: Math.ceil(totalResults / 10),
      currentPage: currentPage,
      item: item,
    };
    return resData;
  }
}
