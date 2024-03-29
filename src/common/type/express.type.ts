import { AccessTokenPayload } from 'src/authentication/dto/AccessToken.payload';
import { MulterS3 } from 'multer-s3';
declare global {
  namespace Express {
    export interface User extends AccessTokenPayload {}
    namespace MulterS3 {
      interface File extends Multer.File {
        bucket: string;
        key: string;
        acl: string;
        contentType: string;
        contentDisposition: null;
        storageClass: string;
        serverSideEncryption: null;
        metadata: any;
        location: string;
        etag: string;
      }
    }
  }
}
