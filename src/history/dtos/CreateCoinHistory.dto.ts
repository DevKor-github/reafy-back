export class CreateCoinHistoryDto {
  userId: number;
  earnAmount: number;
  spendAmount: number;
  itemId: number;
  type: number; //독서기록 0, 아이템 구매 1, 코인 줍기 2
}
