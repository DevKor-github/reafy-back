import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule, utilities } from 'nest-winston';
import { join } from 'path';
import * as winston from 'winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { BookModule } from './book/book.module';
import { CoinModule } from './coin/coin.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { HistoryModule } from './history/history.module';
import { ItemModule } from './item/item.module';
import { MemoModule } from './memo/memo.module';
import { StatisticsModule } from './statistics/statistics.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_DATABASE,
      autoLoadEntities: true, //자동으로 엔티티 load
      synchronize: true, //개발 중에만 쓰고, 실제 프로덕트에선 끄기
      logging: true, // 자동으로 쿼리문과 에러 로깅,
      timezone: 'Asia/Seoul',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', ''),
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(), // 로그 남긴 시각 표시
            winston.format.ms(),
            utilities.format.nestLike('Reafy', {
              // 로그 출처인 appName('Reafy') 설정
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    UserModule,
    BookModule,
    AuthenticationModule,
    HistoryModule,
    ItemModule,
    MemoModule,
    StatisticsModule,
    CoinModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
