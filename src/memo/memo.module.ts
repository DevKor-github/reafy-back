import { Module } from '@nestjs/common';
import { MemoController } from './memo.controller';
import { MemoService } from './memo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Memo } from 'src/model/entity/Memo.entity';
import { MemoHashtag } from 'src/model/entity/MemoHashtags.entity';
import { Hashtag } from 'src/model/entity/Hashtag.entity';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { MulterModule } from '@nestjs/platform-express';
import { MemoRepository } from './repository/memo.repository';
import { MemoHashtagRepository } from './repository/memo-hashtag.repository';
import { HashtagRepository } from './repository/hashtag.repository';

@Module({
  controllers: [MemoController],
  providers: [
    MemoService,
    MemoRepository,
    MemoHashtagRepository,
    HashtagRepository,
  ],
  imports: [
    TypeOrmModule.forFeature([Memo, MemoHashtag, Hashtag]),
    AuthenticationModule,
    MulterModule.register({ dest: './upload/files' }),
  ],
})
export class MemoModule {}
