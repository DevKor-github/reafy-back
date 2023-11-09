import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from 'src/model/entity/Book.entity';
import { HttpService } from '@nestjs/axios/dist';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { SearchBookDto } from './dto/searchbook.dto';
import { RegisterBookDto } from './dto/registerbook.dto';
import { BookshelfBook } from 'src/model/entity/BookshelfBook.entity';
import { SaveInBookshelfDto } from './dto/saveinbookshelf.dto';
import { register } from 'module';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookshelfBook)
    private readonly bookshelfRepository: Repository<BookshelfBook>,
    private readonly httpService: HttpService,
  ) {} //Book repository inject

  findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async searchBook(query: string, index: number): Promise<SearchBookDto[]> {
    const result = await this.httpService
      .get(
        `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${process.env.ALADIN_API_KEY}&Query=${query}&output=js&Version=20131101&start=${index}`,
      )
      .toPromise();
    let resultArray: SearchBookDto[] = [];
    for (let i = 0; i < 10; i++) {
      //음.. 구현이 별로 맘에 들지 않는다
      const tempObj: SearchBookDto = {
        isbn13: result.data.item[i].isbn13,
        cover: result.data.item[i].cover,
        title: result.data.item[i].title,
        author: result.data.item[i].author,
      };
      resultArray.push(tempObj);
    }
    return resultArray;
  }

  async registerBook(isbn13: string): Promise<any> {
    const result = await this.httpService
      .get(
        `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${process.env.ALADIN_API_KEY}&itemIdType=ISBN13&ItemId=${isbn13}&output=js&Version=20131101`,
      )
      .toPromise();
    const registeredBook: RegisterBookDto = {
      isbn13: result.data.item[0].isbn13,
      title: result.data.item[0].title,
      author: result.data.item[0].author,
      content: result.data.item[0].description,
      publisher: result.data.item[0].publisher,
      pages: result.data.item[0].subInfo.itemPage,
      category: result.data.item[0].categoryName,
      thumbnailURL: result.data.item[0].cover,
      link: result.data.item[0].link,
    };
    return await this.bookRepository.save(registeredBook);
  }

  async saveInBookshelf(userBookItems: SaveInBookshelfDto) {
    const book = await this.bookRepository.findOne({
      where: { isbn13: userBookItems.isbn13 },
    });

    if (book) {
      return await this.bookshelfRepository.save({
        userId: userBookItems.userId,
        bookId: book.id,
        progressState: userBookItems.progressState,
      });
    } else {
      await this.registerBook(userBookItems.isbn13);
      const newBook = await this.bookRepository.findOne({
        where: { isbn13: userBookItems.isbn13 },
      });
      return await this.bookshelfRepository.save({
        userId: userBookItems.userId,
        bookId: newBook.id,
        progressState: userBookItems.progressState,
      });
    }
  }
}
