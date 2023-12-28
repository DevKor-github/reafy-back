import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coin } from 'src/model/entity/Coin.entity';
import { CoinHistory } from 'src/model/entity/CoinHistory.entity';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { Repository } from 'typeorm';
import {
  MonthlyTotalCoinsListDto,
  MonthlyTotalPagesListDto,
  MonthlyTotalReadingTimesListDto,
} from './dtos/Statistics.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(UserBookHistory)
    private readonly userBookHistoryRepository: Repository<UserBookHistory>,
    @InjectRepository(CoinHistory)
    private readonly coinHistoryRepository: Repository<CoinHistory>,
    @InjectRepository(Coin) private readonly coinRepository: Repository<Coin>,
  ) {}

  async getMonthlyTotalPages(userId: number, year: number) {
    const monthlyTotalPagesList = [];
    const resultArray = await this.userBookHistoryRepository.query(
      `SELECT months.month, COALESCE(SUM(end_page - start_page), 0) AS total_pages
      FROM (SELECT '${year}-01' AS month UNION SELECT '${year}-02' UNION SELECT '${year}-03' UNION SELECT '${year}-04' UNION SELECT '${year}-05' UNION SELECT '${year}-06' UNION SELECT '${year}-07' UNION SELECT '${year}-08' UNION SELECT '${year}-09' UNION SELECT '${year}-10' UNION SELECT '${year}-11' UNION SELECT '${year}-12') AS months
      LEFT JOIN user_book_history ON DATE_FORMAT(created_at, '%Y-%m') = months.month AND user_book_history.user_id = ${userId}
      GROUP BY months.month
      ORDER BY months.month;`,
    );

    console.log(resultArray);

    await Promise.all(
      resultArray.map((resultPacket) => {
        monthlyTotalPagesList.push(
          MonthlyTotalPagesListDto.makeRes(resultPacket),
        );
      }),
    );

    return monthlyTotalPagesList;
  }

  /*async getMonthlyTotalEarnedCoins(userId: number, year: number) {
    const monthlyTotalEarnedCoinsList = [];
    const userCoin = await this.coinRepository.findOneOrFail({
      where: { userId: userId },
    });
    const resultArray = await this.coinHistoryRepository.query(
      `SELECT months.month, COALESCE(SUM(earn_amount), 0) AS total_coins
      FROM (SELECT '${year}-01' AS month UNION SELECT '${year}-02' UNION SELECT '${year}-03' UNION SELECT '${year}-04' UNION SELECT '${year}-05' UNION SELECT '${year}-06' UNION SELECT '${year}-07' UNION SELECT '${year}-08' UNION SELECT '${year}-09' UNION SELECT '${year}-10' UNION SELECT '${year}-11' UNION SELECT '${year}-12') AS months
      LEFT JOIN coin_history ON DATE_FORMAT(created_at, '%Y-%m') = months.month AND coin_history.coin_id = ${userCoin.coinId}
      GROUP BY months.month
      ORDER BY months.month;`,
    );

    await Promise.all(
      resultArray.map((resultPacket) => {
        monthlyTotalEarnedCoinsList.push(
          MonthlyTotalCoinsListDto.makeRes(resultPacket),
        );
      }),
    );

    return monthlyTotalEarnedCoinsList;
  }*/

  async getMonthlyTotalReadingTimes(userId: number, year: number) {
    const monthlyTotalReadingTimesList = [];
    const resultArray = await this.userBookHistoryRepository.query(
      `
      SELECT months.month, COALESCE(SUM(duration) DIV 60, 0) AS total_reading_times
      FROM (SELECT '${year}-01' AS month UNION SELECT '${year}-02' UNION SELECT '${year}-03' UNION SELECT '${year}-04' UNION SELECT '${year}-05' UNION SELECT '${year}-06' UNION SELECT '${year}-07' UNION SELECT '${year}-08' UNION SELECT '${year}-09' UNION SELECT '${year}-10' UNION SELECT '${year}-11' UNION SELECT '${year}-12') AS months 
      LEFT JOIN user_book_history ON DATE_FORMAT(created_at, '%Y-%m') = months.month AND user_book_history.user_id = ${userId}
      GROUP BY months.month
      ORDER BY months.month;
      `,
    );
    await Promise.all(
      resultArray.map((resultPacket) => {
        monthlyTotalReadingTimesList.push(
          MonthlyTotalReadingTimesListDto.makeRes(resultPacket),
        );
      }),
    );

    return monthlyTotalReadingTimesList;
  }
}
