import { Module } from '@nestjs/common';
import { BookshelfController } from './bookshelf.controller';
import { BookshelfService } from './bookshelf.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookshelfBook } from 'src/model/entity/BookshelfBook.entity';

@Module({
  controllers: [BookshelfController],
  providers: [BookshelfService],
  imports: [TypeOrmModule.forFeature([BookshelfBook])],
})
export class BookshelfModule {}
