import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBookHistory } from 'src/model/entity/UserBookHistory.entity';
import { Repository } from 'typeorm';
import { CreateUserBookHistoryDto } from './dtos/CreateUserBookHistory.dto';
import { CoinHistory } from 'src/model/entity/CoinHistory.entity';
import { Coin } from 'src/model/entity/Coin.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(UserBookHistory)
    private readonly userBookHistoryRepository: Repository<UserBookHistory>,
    private readonly coinHistoryRepository: Repository<CoinHistory>,
    private readonly coinRepository: Repository<Coin>,
  ) {}

  async createUserBookHistory(
    userId: number,
    createUserBookHistoryDto: CreateUserBookHistoryDto,
  ) {
    const coinHistoryId = (
      await this.createCoinHistory(userId, createUserBookHistoryDto)
    ).coinHistoryId;

    return await this.userBookHistoryRepository.save({
      userId,
      ...createUserBookHistoryDto,
      coinHistoryId,
    });

    //dto 정보 추출
    //Coin earning 정보 추가 로직
    //Coin earning 정보 담아서 userbookhistory 생성
  }

  async createCoinHistory(
    userId: number,
    createUserBookHistoryDto: CreateUserBookHistoryDto,
  ) {
    const userCoin = await this.coinRepository.findOneOrFail({
      where: { userId: userId },
    }); //유저 코인 객체 찾기

    const newCoinHistory = new CoinHistory();
    newCoinHistory.coinId = userCoin.coinId;
    newCoinHistory.earnAmount = createUserBookHistoryDto.coins; //코인 history 엔터티 생성

    userCoin.totalCoin += createUserBookHistoryDto.coins;
    await this.coinRepository.save(userCoin); //코인 증가

    return await this.coinHistoryRepository.save(newCoinHistory); //history 기록
  } //내부 코인 생성 처리 함수. userId로 coinId 찾아서 생성 코인 수만큼 생성
}
