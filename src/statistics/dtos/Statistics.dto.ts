import { ApiProperty } from '@nestjs/swagger';

export class MonthlyTotalPagesListDto {
  @ApiProperty({ description: '월' })
  month: number;

  @ApiProperty({ description: '읽은 총 페이지 수' })
  totalPages: number;

  static makeRes(queryPacket: any) {
    const resData = new MonthlyTotalPagesListDto();
    resData.month = queryPacket.month;
    resData.totalPages = queryPacket.total_pages;

    return resData;
  }
}

export class MonthlyTotalCoinsListDto {
  @ApiProperty({ description: '월' })
  month: number;

  @ApiProperty({ description: '얻은 총 대나무 수' })
  totalCoins: number;

  static makeRes(queryPacket: any) {
    const resData = new MonthlyTotalCoinsListDto();
    resData.month = queryPacket.month;
    resData.totalCoins = queryPacket.total_coins;

    return resData;
  }
}

export class MonthlyTotalReadingTimesListDto {
  @ApiProperty({ description: '월' })
  month: number;

  @ApiProperty({ description: '읽은 총 시간(분)' })
  totalReadingTimes: number;

  static makeRes(queryPacket: any) {
    const resData = new MonthlyTotalReadingTimesListDto();
    resData.month = queryPacket.month;
    resData.totalReadingTimes = queryPacket.total_reading_times;

    return resData;
  }
}
