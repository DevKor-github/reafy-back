import { Injectable } from '@nestjs/common';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserBookHistoryRepository extends Repository<UserBookHistory> {
  constructor(private readonly dataSource: DataSource) {
    super(UserBookHistory, dataSource.createEntityManager());
  }

  async getMonthlyTotalPages(userId: number, year: number) {
    return await this
      .query(`SELECT months.month, COALESCE(SUM(end_page - start_page), 0) AS total_pages
    FROM (SELECT '${year}-01' AS month UNION SELECT '${year}-02' UNION SELECT '${year}-03' UNION SELECT '${year}-04' UNION SELECT '${year}-05' UNION SELECT '${year}-06' UNION SELECT '${year}-07' UNION SELECT '${year}-08' UNION SELECT '${year}-09' UNION SELECT '${year}-10' UNION SELECT '${year}-11' UNION SELECT '${year}-12') AS months
    LEFT JOIN user_book_history ON DATE_FORMAT(created_at, '%Y-%m') = months.month AND user_book_history.user_id = ${userId}
    GROUP BY months.month
    ORDER BY months.month;`);
  }

  async getMonthlyTotalReadingTimes(userId: number, year: number) {
    return await this.query(`
    SELECT months.month, COALESCE(SUM(duration) DIV 60, 0) AS total_reading_times
    FROM (SELECT '${year}-01' AS month UNION SELECT '${year}-02' UNION SELECT '${year}-03' UNION SELECT '${year}-04' UNION SELECT '${year}-05' UNION SELECT '${year}-06' UNION SELECT '${year}-07' UNION SELECT '${year}-08' UNION SELECT '${year}-09' UNION SELECT '${year}-10' UNION SELECT '${year}-11' UNION SELECT '${year}-12') AS months 
    LEFT JOIN user_book_history ON DATE_FORMAT(created_at, '%Y-%m') = months.month AND user_book_history.user_id = ${userId}
    GROUP BY months.month
    ORDER BY months.month;
    `);
  }

  async getStartHistory(bookshelfBookId: number) {
    return await this.findOne({
      where: { bookshelfBookId: bookshelfBookId },
      order: { startPage: 'ASC' },
    });
  }

  async getEndHistory(bookshelfBookId: number) {
    return await this.findOne({
      where: { bookshelfBookId: bookshelfBookId },
      order: { endPage: 'DESC' },
    });
  }
}
