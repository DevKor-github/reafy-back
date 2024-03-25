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
import * as multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

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
    MulterModule.registerAsync({
      useFactory: async () => ({
        storage: multerS3({
          s3: new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY,
              secretAccessKey: process.env.AWS_SECRET_KEY,
            },
          }),
          bucket: process.env.AWS_TEST_BUCKET_NAME,
          // contentType: multerS3.AUTO_CONTENT_TYPE,
          // acl: 'public-read',
          key: function (req, file, cb) {
            cb(null, `${Date.now()}.jpg`);
          },
        }),
      }),
    }),
  ],
})
export class MemoModule {}

//{ dest: './upload/files' }
