import { Hashtag } from './../model/entity/Hashtag.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Memo } from 'src/model/entity/Memo.entity';
import { MemoHashtag } from 'src/model/entity/MemoHashtags.entity';
import { Repository } from 'typeorm';
import { CreateMemoDto } from './dtos/CreateMemo.dto';
import { UpdateMemoDto } from './dtos/UpdateMemo.dto';
import { MemoResDto } from './dtos/MemoRes.dto';

@Injectable()
export class MemoService {
  constructor(
    @InjectRepository(Memo) private readonly memoRepository: Repository<Memo>,
    @InjectRepository(MemoHashtag)
    private readonly memoHashtagRepository: Repository<MemoHashtag>,
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
  ) {}

  async getMemoList(userId: number, page: number) {
    const resultArray = [];
    const memoList = await this.memoRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 10,
      skip: (page - 1) * 10,
    }); //유저 id로 메모 검색

    await Promise.all(
      //각 메모마다 연결되어 있는 해시태그 검색, DTO화
      memoList.map(async (memo) => {
        const hashtags = await this.getHashtagsByMemoId(memo.memoId);
        resultArray.push(await MemoResDto.makeRes(memo, hashtags));
      }),
    );
    return resultArray.sort((a, b) => b.createdAt - a.createdAt); //promise.all + map은 순서가 보장되지 않으므로 다시 sorting
  }

  async getMemoListByHashtag(userId: number, hashtag: string, page: number) {
    /*
    특정 hashtag 키워드로 hashtag repo에서 검색, hashtagId 가져오기
    hashtagId로 MemoHashtag Repo에서 left join으로 memo Repo까지 find.
    createdAt 순으로 ordering, list화.
    */
    const resultArray = [];
    const selectedHashtag = await this.hashtagRepository.findOne({
      where: { keyword: hashtag }, //해시태그 찾기
    });
    const offset = (page - 1) * 10;
    const memoList = await this.memoHashtagRepository.query(
      `
      SELECT sq.memo_hashtag_id, memo.user_id, memo.memo_id, memo.bookshelf_book_id, memo.content, memo.page, memo.imageURL, memo.created_at, memo.updated_at
      FROM (SELECT * FROM(SELECT * FROM memo_hashtag GROUP BY hashtag_id, memo_id) AS subquery WHERE deleted_at IS NULL) as sq
      LEFT JOIN memo ON sq.memo_id = memo.memo_id
      WHERE memo.user_id = ${userId} AND sq.hashtag_id = ${selectedHashtag.hashtagId} AND memo.deleted_at IS NULL
      ORDER BY memo.created_at DESC
      LIMIT 10 OFFSET ${offset};
      `,
      /*해시태그 ID를 통해 메모-해시태그와 메모 테이블 join하여 해당하는 메모 검색. FROM 절의 subquery를 이중으로 사용함. 
      첫 번째 subquery는 GROUP BY를 통해 해시태그 id - 메모 id 쌍에 대한 중복 제거,
      두 번째 subquery(sq)는 subquery에 대하여 softDelete된 엔트리들을 제거해줌 -> ORM 이용했으면 더 편했을 듯 */
    );

    await Promise.all(
      memoList.map(async (memo) => {
        memo.userId = memo.user_id;
        memo.bookshelfBookId = memo.bookshelf_book_id;
        memo.memoId = memo.memo_id;
        memo.createdAt = memo.created_at;
        memo.updatedAt = memo.updated_at;
        const hashtags = await this.getHashtagsByMemoId(memo.memo_id);
        resultArray.push(await MemoResDto.makeRes(memo, hashtags));
      }),
    );
    return resultArray.sort((a, b) => b.createdAt - a.createdAt);
    //각 메모에 대하여 DTO화 후 리턴.
  }

  async getMemoListByBookshelfBook(
    userId: number,
    bookshelfBookId: number,
    page: number,
  ) {
    const resultArray = [];
    const offset = (page - 1) * 10;
    const memoList = await this.memoRepository.query(
      `
      SELECT * 
      FROM memo
      WHERE memo.bookshelf_book_id = ${bookshelfBookId} AND memo.user_id = ${userId} AND memo.deleted_at IS NULL
      ORDER BY memo.created_at DESC
      LIMIT 10 OFFSET ${offset};
      `,
      //Soft Delete 체크.
    );

    await Promise.all(
      memoList.map(async (memo) => {
        memo.userId = memo.user_id;
        memo.bookshelfBookId = memo.bookshelf_book_id;
        memo.memoId = memo.memo_id;
        memo.createdAt = memo.created_at;
        memo.updatedAt = memo.updated_at;

        const hashtags = await this.getHashtagsByMemoId(memo.memo_id);

        resultArray.push(await MemoResDto.makeRes(memo, hashtags));
      }),
    );

    return resultArray.sort((a, b) => b.createdAt - a.createdAt);
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
