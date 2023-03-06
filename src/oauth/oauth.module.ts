import { Module } from '@nestjs/common';
// import { PassportModule } from '@nestjs/passport';
// import { AppleStrategy } from './strategies/apple.strategy';
// import { KakaoStrategy } from './strategies/kakao.strategy';
// import { GoogleStrategy } from './strategies/google.strategy';
// import { NaverStrategy } from './strategies/naver.strategy';
// import { JwtModule } from '@nestjs/jwt';
// import { OAuthService } from './services/oauth.service';
// import { OAuthController } from './controllers/oauth.controller';
import { HttpModule } from '@nestjs/axios';
import { OAuthService } from './oauth.service';
import { OAuthController } from './oauth.controller';
// import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
  imports: [
    // JwtModule.register({
    //   secret: 'secret',
    //   signOptions: {
    //     expiresIn: '180d',
    //   },
    // }),
    // PassportModule.register({
    //   defaultStrategy: 'jwt',
    // }),
    HttpModule,
  ],
  providers: [
    // KakaoStrategy,
    // GoogleStrategy,
    // FacebookStrategy,
    // AppleStrategy,
    // NaverStrategy,
    OAuthService,
  ],
  exports: [OAuthService],
  controllers: [OAuthController],
})
export class OAuthModule {}
