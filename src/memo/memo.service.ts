import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { CreateMemoDto } from './dtos/CreateMemo.dto';
import { UpdateMemoDto } from './dtos/UpdateMemo.dto';
import { MemoResDto, MemoResWithPagesDto } from './dtos/MemoRes.dto';
import { MemoRepository } from './repository/memo.repository';
import { MemoHashtagRepository } from './repository/memo-hashtag.repository';
import { HashtagRepository } from './repository/hashtag.repository';
import { Hashtag } from 'src/model/entity/Hashtag.entity';
import {
  HashtagNotFoundException,
  MemoNotFoundException,
} from 'src/common/exception/memo-service.exception';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class MemoService {
  constructor(
    private readonly memoRepository: MemoRepository,
    private readonly memoHashtagRepository: MemoHashtagRepository,
    private readonly hashtagRepository: HashtagRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async getMemoList(
    userId: number,
    page: number,
  ): Promise<MemoResWithPagesDto> {
    const memoList = [];
    const resultObject = await this.memoRepository.getMemoListById(
      userId,
      page,
    );
    const resultArray = resultObject.resultArray;

    await Promise.all(
      resultArray.map(async (memo) => {
        const hashtags = await this.getHashtagsByMemoId(memo.memoId);
        memoList.push(await MemoResDto.makeRes(memo, hashtags));
      }),
    );
    memoList.sort((a, b) => b.createdAt - a.createdAt); //promise.all + map은 순서가 보장되지 않으므로 다시 sorting

    return MemoResWithPagesDto.makeRes(
      resultObject.totalResults,
      resultArray.length,
      page,
      memoList,
    );
  }

  async processMemoList(resultArray: any): Promise<MemoResDto[]> {
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

  async getMemoListByHashtag(
    userId: number,
    hashtag: string,
    page: number,
  ): Promise<MemoResWithPagesDto> {
    //hashtag -> hashtagId 검색, hashtagId로 MemoHashtag에서 LEFT JOIN
    const selectedHashtag = await this.hashtagRepository.findOne({
      where: { keyword: hashtag },
    });
    if (!selectedHashtag) throw HashtagNotFoundException(); //해당하는 해시태그가 존재하지 않는 경우
    const resultObject = await this.memoHashtagRepository.getMemoListByHashtag(
      userId,
      selectedHashtag.hashtagId,
      (page - 1) * 10,
    );
    const resultArray = resultObject.resultArray;
    const totalResults = Number(resultObject.totalResults[0].total_results);

    const memoList = await this.processMemoList(resultArray);

    return MemoResWithPagesDto.makeRes(
      totalResults,
      memoList.length,
      page,
      memoList,
    );
  }

  async getMemoListByBookshelfBook(
    userId: number,
    bookshelfBookId: number,
    page: number,
  ): Promise<MemoResWithPagesDto> {
    const resultObject = await this.memoRepository.getMemoListByBookshelfBookId(
      userId,
      bookshelfBookId,
      (page - 1) * 10,
    );
    const resultArray = resultObject.resultArray;

    // return await this.processMemoList(resultArray);
    return MemoResWithPagesDto.makeRes(
      resultObject.totalResults,
      resultArray.length,
      page,
      await this.processMemoList(resultArray),
    );
  }

  async getHashtagsByMemoId(memoId: number): Promise<string[]> {
    //해당 메모가 가지고 있는 Hashtag array를 반환하는 내부 함수
    const hashtags = [];
    const hashtagData =
      await this.memoHashtagRepository.getHashtagsByMemoId(memoId);

    await Promise.all(
      hashtagData.map(async (hashtag) => hashtags.push(hashtag.keyword)),
    );

    return hashtags;
  }

  async getMemoDetail(userId: number, memoId: number): Promise<MemoResDto> {
    const memo = await this.memoRepository.findOne({
      where: {
        userId: userId,
        memoId: memoId,
      },
    });
    if (!memo) throw MemoNotFoundException(); //해당 메모 ID로 검색되는 메모가 존재하지 않음

    const hashtags = await this.getHashtagsByMemoId(memoId);

    return await MemoResDto.makeRes(memo, hashtags);
  }

  async createMemo(
    userId: number,
    createMemoDto: CreateMemoDto,
    file: Express.MulterS3.File,
  ): Promise<MemoResDto> {
    const { bookshelfBookId, content, page, hashtag } = createMemoDto; //id, page number화, hashtag 파싱.
    const createdMemo = await this.memoRepository.save({
      //메모 생성
      userId: userId,
      bookshelfBookId: Number(bookshelfBookId),
      content: content,
      page: Number(page),
      imageURL: file ? file.location : null,
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
          //메모-해시태그 연결체 생성
          memoId: createdMemo.memoId,
          hashtagId: existingHashtag.hashtagId,
        });
      }),
    );

    return await MemoResDto.makeRes(createdMemo, splitedHastags);
  }

  async createHashtag(userId: number, hashtag: string): Promise<Hashtag> {
    return await this.hashtagRepository.save({
      userId: userId,
      keyword: hashtag,
    });
  }

  async updateMemo(
    userId: number,
    memoId: number,
    updateMemoDto: UpdateMemoDto,
    file: Express.MulterS3.File,
  ): Promise<MemoResDto> {
    const { content, page, hashtag } = updateMemoDto;

    await this.memoHashtagRepository.softDelete({ memoId: memoId });

    const existingMemo = await this.memoRepository.findOne({
      where: { memoId: memoId },
    });

    if (!existingMemo) throw MemoNotFoundException(); //해당하는 ID의 메모가 존재하지 않음

    existingMemo.content = content;
    existingMemo.page = Number(page);
    existingMemo.imageURL = file ? file.location : null;
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

  async deleteMemo(userId: number, memoId: number): Promise<string> {
    const deletedMemo = await this.memoRepository.findOne({
      where: { memoId: memoId, userId: userId },
    });
    if (!deletedMemo) throw MemoNotFoundException(); //해당하는 ID의 메모가 존재하지 않음
    await this.memoRepository.softDelete({ memoId: memoId, userId: userId });
    return `memoId : ${memoId} is deleted successfully`;
  }
}
