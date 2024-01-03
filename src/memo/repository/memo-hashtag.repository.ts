import { Injectable } from '@nestjs/common';
import { MemoHashtag } from 'src/model/entity/MemoHashtags.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MemoHashtagRepository extends Repository<MemoHashtag> {
  constructor(private dataSource: DataSource) {
    super(MemoHashtag, dataSource.createEntityManager());
  }

  async getMemoListByHashtag(
    userId: number,
    hashtagId: number,
    offset: number,
  ) {
    return await this.query(`
    SELECT sq.memo_hashtag_id, memo.user_id, memo.memo_id, memo.bookshelf_book_id, memo.content, memo.page, memo.imageURL, memo.created_at, memo.updated_at
    FROM (SELECT * FROM(SELECT * FROM memo_hashtag GROUP BY hashtag_id, memo_id) AS subquery WHERE deleted_at IS NULL) as sq
    LEFT JOIN memo ON sq.memo_id = memo.memo_id
    WHERE memo.user_id = ${userId} AND sq.hashtag_id = ${hashtagId} AND memo.deleted_at IS NULL
    ORDER BY memo.created_at DESC
    LIMIT 10 OFFSET ${offset};
    `);
    /*해시태그 ID를 통해 메모-해시태그와 메모 테이블 join하여 해당하는 메모 검색. FROM 절의 subquery를 이중으로 사용함. 
      첫 번째 subquery는 GROUP BY를 통해 해시태그 id - 메모 id 쌍에 대한 중복 제거,
      두 번째 subquery(sq)는 subquery에 대하여 softDelete된 엔트리들을 제거해줌 -> ORM 이용했으면 더 편했을 듯 */
  }
}
