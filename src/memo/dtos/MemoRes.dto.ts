import { Memo } from 'src/model/entity/Memo.entity';

export class MemoRes {
  memoId: number;
  userId: number;
  bookshelfBookId: number;
  content: string;
  page: number;
  imageURL: string;
  hashtag: Array<string>;

  static async makeRes(memoObject: Memo) {} //각각의 객체에 대해서 파싱하고 Res Dto로 변환
}
