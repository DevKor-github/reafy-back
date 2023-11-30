export class BookshelfBookDetailDto {
  bookshelfbookId: number;
  userId: number;
  progressState: string;
  bookId: number;
  title: string;
  author: string;
  content: string;
  publisher: string;
  thumbnailURL: string;
  link: string;
  category: string;

  pages: number;
  startPage: number;
  endPage: number;

  static async makeRes(data, startPage, endPage) {
    const resData: BookshelfBookDetailDto = { startPage, endPage, ...data };
    return resData;
  }
}
