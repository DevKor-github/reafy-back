import { Module } from '@nestjs/common';
import { MemoController } from './memo.controller';
import { MemoService } from './memo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Memo } from 'src/model/entity/Memo.entity';
import { MemoHashtag } from 'src/model/entity/MemoHashtags.entity';
import { Hashtag } from 'src/model/entity/Hashtag.entity';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [MemoController],
  providers: [MemoService],
  imports: [
    TypeOrmModule.forFeature([Memo, MemoHashtag, Hashtag]),
    AuthenticationModule,
    MulterModule.register({ dest: './upload/files' }),
  ],
})
export class MemoModule {}
