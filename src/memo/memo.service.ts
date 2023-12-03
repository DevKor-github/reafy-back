import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hashtag } from 'src/model/entity/Hashtag.entity';
import { Memo } from 'src/model/entity/Memo.entity';
import { MemoHashtag } from 'src/model/entity/MemoHashtags.entity';
import { Repository } from 'typeorm';
import { CreateMemoDto } from './dtos/CreateMemo.dto';
import { UpdateMemoDto } from './dtos/UpdateMemo.dto';
import { MemoRes } from './dtos/MemoRes.dto';

@Injectable()
export class MemoService {
  constructor(
    @InjectRepository(Memo) private readonly memoRepository: Repository<Memo>,
    @InjectRepository(MemoHashtag)
    private readonly memoHashtagRepository: Repository<MemoHashtag>,
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
  ) {}

  async getMemoList(userId: number) {
    const memoList = await this.memoRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    memoList.map((memo) => {
      return MemoRes.makeRes(memo);
    });
    return memoList;
  }

  async getMemoListByHashtag(userId: number, hashtag: string) {}

  async getMemoListByBookshelfBook(userId: number, bookshelfBookId: number) {}

  async getMemoDetail(userId: number, memoId: number) {}

  async createMemo(
    userId: number,
    createMemoDto: CreateMemoDto,
    file: Express.Multer.File,
  ) {} //주어진 해쉬태그가 존재하면 바로 해쉬태그 연결체 만들고, 아니면 createHashtag 실행 후 그것으로 연결

  async createHashtag(hashtag: string) {} //리턴값으로 해당 해쉬태그 아이디

  async updateMemo(
    userId: number,
    memoId: number,
    updateMemoDto: UpdateMemoDto,
    file: Express.Multer.File,
  ) {}

  async deleteMemo(userId: number, memoId: number) {}
}
