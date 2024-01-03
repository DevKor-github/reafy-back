import { Injectable } from '@nestjs/common';
import { CreateMemoDto } from './dtos/CreateMemo.dto';
import { UpdateMemoDto } from './dtos/UpdateMemo.dto';
import { MemoResDto } from './dtos/MemoRes.dto';
import { MemoRepository } from './repository/memo.repository';
import { MemoHashtagRepository } from './repository/memo-hashtag.repository';
import { HashtagRepository } from './repository/hashtag.repository';

@Injectable()
export class MemoService {
  constructor(
    private readonly memoRepository: MemoRepository,
    private readonly memoHashtagRepository: MemoHashtagRepository,
    private readonly hashtagRepository: HashtagRepository,
  ) {}

  async getMemoList(userId: number, page: number) {
    const memoList = [];
    const resultArray = await this.memoRepository.getMemoListById(userId, page);

    await Promise.all(
      resultArray.map(async (memo) => {
        const hashtags = await this.getHashtagsByMemoId(memo.memoId);
        memoList.push(await MemoResDto.makeRes(memo, hashtags));
      }),
    );
    return memoList.sort((a, b) => b.createdAt - a.createdAt); //promise.all + map은 순서가 보장되지 않으므로 다시 sorting
  }

  async getMemoListByHashtag(userId: number, hashtag: string, page: number) {
    //hashtag -> hashtagId 검색, hashtagId로 MemoHashtag에서 LEFT JOIN
    const selectedHashtag = await this.hashtagRepository.findOne({
      where: { keyword: hashtag },
    });
    const resultArray = await this.memoHashtagRepository.getMemoListByHashtag(
      userId,
      selectedHashtag.hashtagId,
      (page - 1) * 10,
    );
    return await this.processMemoList(resultArray);
    /*await Promise.all(
      resultArray.map(async (memo) => {
        memo.userId = memo.user_id;
        memo.bookshelfBookId = memo.bookshelf_book_id;
        memo.memoId = memo.memo_id;
        memo.createdAt = memo.created_at;
        memo.updatedAt = memo.updated_at;
        const hashtags = await this.getHashtagsByMemoId(memo.memo_id);
        memoList.push(await MemoResDto.makeRes(memo, hashtags));
      }),
    );
    return memoList.sort((a, b) => b.createdAt - a.createdAt);*/
  }

  async processMemoList(resultArray: any) {
    const memoList = [];
    await Promise.all(
      resultArray.map(async (memo) => {
        memo.userId = memo.user_id;
        memo.bookshelfBookId = memo.bookshelf_book_id;
        memo.memoId = memo.memo_id;
        memo.createdAt = memo.created_at;
        memo.updatedAt = memo.updated_at;
        const hashtags = await this.getHashtagsByMemoId(memo.memo_id);
        memoList.push(await MemoResDto.makeRes(memo, hashtags));
      }),
    );
    return memoList.sort((a, b) => b.createdAt - a.createdAt);
  }

  async getMemoListByBookshelfBook(
    userId: number,
    bookshelfBookId: number,
    page: number,
  ) {
    const memoList = [];
    const resultArray = await this.memoRepository.getMemoListByBookshelfBookId(
      userId,
      bookshelfBookId,
      (page - 1) * 10,
    );

    await Promise.all(
      resultArray.map(async (memo) => {
        memo.userId = memo.user_id;
        memo.bookshelfBookId = memo.bookshelf_book_id;
        memo.memoId = memo.memo_id;
        memo.createdAt = memo.created_at;
        memo.updatedAt = memo.updated_at;
        const hashtags = await this.getHashtagsByMemoId(memo.memo_id);

        memoList.push(await MemoResDto.makeRes(memo, hashtags));
      }),
    );

    return memoList.sort((a, b) => b.createdAt - a.createdAt);
  }

  async getHashtagsByMemoId(memoId: number) {
    //해당 메모가 가지고 있는 Hashtag array를 반환하는 내부 함수
    const hashtags = [];
    const hashtagData = await this.memoHashtagRepository.query(
      `
    SELECT hashtag.keyword
    FROM memo_hashtag
    LEFT JOIN hashtag on memo_hashtag.hashtag_id = hashtag.hashtag_id
    WHERE memo_hashtag.memo_id = ${memoId} AND memo_hashtag.deleted_at IS NULL;
    `,
    );

    hashtagData.map((hashtag) => hashtags.push(hashtag.keyword));

    return hashtags;
  }

  async getMemoDetail(userId: number, memoId: number) {
    /*
    memoId로 select해서 반납. MemoRes에서 해시태그 파싱.
    */
    const memo = await this.memoRepository.findOne({
      where: {
        userId: userId,
        memoId: memoId,
      },
    });

    const hashtags = await this.getHashtagsByMemoId(memoId);

    return await MemoResDto.makeRes(memo, hashtags);
  }

  async createMemo(
    userId: number,
    createMemoDto: CreateMemoDto,
    file: Express.Multer.File,
  ) {
    const { bookshelfBookId, content, page, hashtag } = createMemoDto; //id, page number화, hashtag 파싱.

    const createdMemo = await this.memoRepository.save({
      //메모 생성
      userId: userId,
      bookshelfBookId: Number(bookshelfBookId),
      content: content,
      page: Number(page),
      imageURL: file ? file.path : null,
    });

    const splitedHastags = hashtag.split(', '); //hashtag 파싱

    await Promise.all(
      splitedHastags.map(async (hashtag) => {
        let existingHashtag = await this.hashtagRepository.findOne({
          //해시태그 존재 여부 체크
          where: { keyword: hashtag },
        });
        if (!existingHashtag) {
          existingHashtag = await this.createHashtag(userId, hashtag); //해시태그 생성
        }
        await this.memoHashtagRepository.save({
          //메모-해시태그 연결체
          memoId: createdMemo.memoId,
          hashtagId: existingHashtag.hashtagId,
        });
      }),
    );

    return await MemoResDto.makeRes(createdMemo, splitedHastags);
  }

  async createHashtag(userId: number, hashtag: string) {
    return await this.hashtagRepository.save({
      userId: userId,
      keyword: hashtag,
    });
  } //리턴값으로 해당 해쉬태그 아이디

  async updateMemo(
    userId: number,
    memoId: number,
    updateMemoDto: UpdateMemoDto,
    file: Express.Multer.File,
  ) {
    const { content, page, hashtag } = updateMemoDto;

    await this.memoHashtagRepository.softDelete({ memoId: memoId });

    const existingMemo = await this.memoRepository.findOne({
      where: { memoId: memoId },
    });

    existingMemo.content = content;
    existingMemo.page = page;
    existingMemo.imageURL = file ? file.path : null;
    await this.memoRepository.save(existingMemo); //메모 내용, 페이지, 이미지 업데이트

    const splitedNewHastags = hashtag.split(', ');
    await Promise.all(
      splitedNewHastags.map(async (hashtag) => {
        let existingHashtag = await this.hashtagRepository.findOne({
          where: { keyword: hashtag }, //해당 해시태그가 이미 존재하는지 검색
        });
        if (!existingHashtag) {
          existingHashtag = await this.createHashtag(userId, hashtag); //없으면 테이블에 생성
        }
        await this.memoHashtagRepository.save({
          //메모-해시태그 관계 만들기
          memoId: existingMemo.memoId,
          hashtagId: existingHashtag.hashtagId,
        });
      }),
    );

    return await MemoResDto.makeRes(existingMemo, splitedNewHastags);
  }

  async deleteMemo(userId: number, memoId: number) {
    await this.memoRepository.softDelete({ memoId: memoId, userId: userId });
    return `memo ${memoId} is deleted successfully`;
  }
}
