import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateMemoDto } from 'src/memo/dtos/CreateMemo.dto';
import { UpdateMemoDto } from 'src/memo/dtos/UpdateMemo.dto';

export function ApiFile(method: string, fieldname: string) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldname)),
    ApiConsumes('multipart/form-data'),
    ApiBody({ type: method == 'create' ? CreateMemoDto : UpdateMemoDto }),
  );
}
