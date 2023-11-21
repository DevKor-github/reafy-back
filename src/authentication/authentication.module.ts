import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserModule } from 'src/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRE, JWT_SECRET_KEY } from 'src/common/constant/authentication.constant';
import { JwtAccessStrategy } from './jwt-access.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: ACCESS_TOKEN_EXPIRE, },
    }),
    UserModule,
    HttpModule,
    PassportModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthenticationModule { }
