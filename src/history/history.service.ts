import { CreateCoinHistoryDto } from './dtos/CreateCoinHistory.dto';
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
    /*@InjectRepository(CoinHistory)
    private readonly coinHistoryRepository: Repository<CoinHistory>,*/
    /*@InjectRepository(Coin) private readonly coinRepository: Repository<Coin>*/
  ) {}

  async getUserBookHistory(userId: number) {
    const userBookHistoryList = await this.userBookHistoryRepository.find({
      where: { userId: userId },
    });
    return userBookHistoryList;
  }
  async getUserBookHistoryByBookshelfBook(
    userId: number,
    bookshelfBookId: number,
  ) {
    const userBookHistoryList = await this.userBookHistoryRepository.find({
      where: { userId: userId, bookshelfBookId: bookshelfBookId },
    });
    return userBookHistoryList;
  }
  async createUserBookHistory(
    userId: number,
    createUserBookHistoryDto: CreateUserBookHistoryDto,
  ) {
    console.log(CreateUserBookHistoryDto);
    /*const createCoinHistoryDto = new CreateCoinHistoryDto();

    createCoinHistoryDto.userId = userId;
    createCoinHistoryDto.earnAmount = createUserBookHistoryDto.coins;
    createCoinHistoryDto.type = 0;

    const coinHistoryId = (await this.createCoinHistory(createCoinHistoryDto))
      .coinHistoryId;
    */
    return await this.userBookHistoryRepository.save({
      userId,
      ...createUserBookHistoryDto,
    });

    //dto 정보 추출
    //Coin earning 정보 추가 로직
    //Coin earning 정보 담아서 userbookhistory 생성
  }

  /*async createCoinHistory(createCoinHistoryDto: CreateCoinHistoryDto) {
    const userCoin = await this.coinRepository.findOneOrFail({
      where: { userId: createCoinHistoryDto.userId },
    }); //유저 코인 객체 찾기

    const newCoinHistory = new CoinHistory();

    newCoinHistory.coinId = userCoin.coinId;
    newCoinHistory.earnAmount = createCoinHistoryDto.earnAmount
      ? createCoinHistoryDto.earnAmount
      : 0; //코인 history 엔터티 생성
    newCoinHistory.spendAmount = createCoinHistoryDto.spendAmount
      ? createCoinHistoryDto.spendAmount
      : 0;
    newCoinHistory.itemId = createCoinHistoryDto.itemId;
    newCoinHistory.type = createCoinHistoryDto.type;

    userCoin.totalCoin += newCoinHistory.earnAmount;
    userCoin.totalCoin -= newCoinHistory.spendAmount;
    await this.coinRepository.save(userCoin); //코인 증가. 이것도 CoinService 개발하면 대체
    //

    return await this.coinHistoryRepository.save(newCoinHistory); //history 기록
  } //내부 코인 생성 처리 함수. userId로 coinId 찾아서 생성 코인 수만큼 생성*/
}
