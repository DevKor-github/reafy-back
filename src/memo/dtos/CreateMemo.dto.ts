export class CreateMemoDto {
  bookshelfBookId: number;
  content: string;
  page: number;
  hashtag: string; //묶어서 줄 수 있나? ("경영,경제,자기계발") 이런 식.. 받을 때도 ,로 구분된 형태로 줘야 한다..
}
/*
bookshelf_book_id, content, page, photo, hashtag */

//
