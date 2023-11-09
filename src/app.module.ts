import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { BookshelfModule } from './bookshelf/bookshelf.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'] }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true, //자동으로 엔티티 load
      synchronize: true, //개발 중에만 쓰고, 실제 프로덕트에선 끄기
      logging: true, // 자동으로 쿼리문과 에러 로깅
    }),
    UserModule,
    BookModule,
    BookshelfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
