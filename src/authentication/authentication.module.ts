import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserModule } from 'src/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRE } from 'src/common/constant/authentication.constant';
import { JwtAccessStrategy } from './jwt-access.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { CoinService } from 'src/coin/coin.service';
import { CoinModule } from 'src/coin/coin.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET_KEY"),
        signOptions: { expiresIn: ACCESS_TOKEN_EXPIRE, },
      })
    }),
    UserModule,
    CoinModule,
    HttpModule,
    PassportModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthenticationModule { }
