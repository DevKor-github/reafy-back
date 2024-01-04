import { Injectable } from '@nestjs/common';
import { Memo } from 'src/model/entity/Memo.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MemoRepository extends Repository<Memo> {
  constructor(private dataSource: DataSource) {
    super(Memo, dataSource.createEntityManager());
  }
  async getMemoListById(userId: number, page: number) {
    return await this.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 10,
      skip: (page - 1) * 10,
    });
  }

  async getMemoListByBookshelfBookId(
    userId: number,
    bookshelfBookId: number,
    offset: number,
  ) {
    return await this.query(`
  SELECT * 
  FROM memo
  WHERE memo.bookshelf_book_id = ${bookshelfBookId} AND memo.user_id = ${userId} AND memo.deleted_at IS NULL
  ORDER BY memo.created_at DESC
  LIMIT 10 OFFSET ${offset};
  `);
  }
  //Soft Delete 체크.
}
