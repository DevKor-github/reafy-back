import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookshelfBook } from 'src/model/entity/BookshelfBook.entity';
import { Repository } from 'typeorm';
import { SaveInBookshelfDto } from './dto/saveinbookshelf.dto';

@Injectable()
export class BookshelfService {
  constructor(
    @InjectRepository(BookshelfBook)
    private readonly bookshelfRepository: Repository<BookshelfBook>,
  ) {}

  /*async saveInBookshelf(userBookItems: SaveInBookshelfDto) {
    await;
  }*/
}
