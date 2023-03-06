import { Injectable } from '@nestjs/common';

@Injectable()
export class OAuthService {
  //   async verifyOAuthAccessToken(
  //     provider: Providers,
  //     pId: string,
  //     oauthAccessToken: string,
  //   ): Promise<void> {
  //     switch (provider) {
  //       case Providers.APPLE:
  //         await this.verifyApple(pId, oauthAccessToken);
  //         break;
  //       case Providers.FACEBOOK:
  //         await this.verifyFacebook(pId, oauthAccessToken);
  //         break;
  //       case Providers.GOOGLE:
  //         await this.verifyGoogle(pId, oauthAccessToken);
  //         break;
  //       case Providers.KAKAO:
  //         await this.verifyKakao(pId, oauthAccessToken);
  //         break;
  //       case Providers.NAVER:
  //         await this.verifyNaver(pId, oauthAccessToken);
  //         break;
  //       default:
  //         throw new BadRequestException();
  //     }
  //   }
  //   private async verifyApple(
  //     pId: string,
  //     oauthAccessToken: string,
  //   ): Promise<void> {
  //     // const unauthorizedException = new UnauthorizedException(
  //     //   constants.default.errorMessages.UNAUTHORIZED_SOCIAL,
  //     // );
  //     // try {
  //     //   const tokenDecodeHeader: { kid: string; alg: string } = jwtDecode<{
  //     //     kid: string;
  //     //     alg: string;
  //     //   }>(oauthAccessToken, {
  //     //     header: true,
  //     //   });
  //     //   const client: jwksClient.JwksClient = await jwksClient({
  //     //     jwksUri: 'https://appleid.apple.com/auth/keys',
  //     //   });
  //     //   let signingKey = null;
  //     //   await new Promise<void>((resolve) =>
  //     //     client.getSigningKey(tokenDecodeHeader.kid, async (err, key) => {
  //     //       if (err) throw unauthorizedException;
  //     //       signingKey = key.publicKey;
  //     //       resolve();
  //     //     }),
  //     //   );
  //     //   const result: AppleVerifyResultDto = jwt.verify(
  //     //     oauthAccessToken,
  //     //     signingKey,
  //     //   ) as AppleVerifyResultDto;
  //     //   /**
  //     //    * 검증부분
  //     //    */
  //     //   if (
  //     //     result.aud !== process.env.APPLE_APP_ANDROID_CLIENT_ID &&
  //     //     result.aud !== process.env.APPLE_APP_IOS_CLIENT_ID &&
  //     //     result.aud !== process.env.APPLE_APP_IOS_DEV_CLIENT_ID
  //     //   ) {
  //     //     throw unauthorizedException;
  //     //   }
  //     //   if (new Date().getTime() / 1000 > result.exp) throw unauthorizedException;
  //     //   if (result.sub != pId) throw unauthorizedException;
  //     //   return {
  //     //     pId: result.sub,
  //     //     accessToken: oauthAccessToken,
  //     //   };
  //     // } catch (e) {
  //     //   throw unauthorizedException;
  //     // }
  //   }
  //   private async verifyGoogle(
  //     pId: string,
  //     oauthAccessToken: string,
  //   ): Promise<void> {
  //     // try {
  //     //   const response = await axios({
  //     //     url:
  //     //       'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' +
  //     //       oauthAccessToken,
  //     //     method: 'get',
  //     //   });
  //     //   if (pId !== response.data.user_id) {
  //     //     throw new UnauthorizedException(
  //     //       constants.default.errorMessages.UNAUTHORIZED_SOCIAL,
  //     //     );
  //     //   }
  //     // } catch (e) {
  //     //   throw new UnauthorizedException(
  //     //     constants.default.errorMessages.UNAUTHORIZED_SOCIAL,
  //     //   );
  //     // }
  //   }
  //   private async verifyFacebook(
  //     pId: string,
  //     oauthAccessToken: string,
  //   ): Promise<void> {
  //     // try {
  //     //   const response = await axios({
  //     //     url: 'https://graph.facebook.com/me?access_token=' + oauthAccessToken,
  //     //     method: 'get',
  //     //   });
  //     //   console.log(response);
  //     //   if (pId !== response.data.id) {
  //     //     throw new UnauthorizedException(
  //     //       constants.default.errorMessages.UNAUTHORIZED_SOCIAL,
  //     //     );
  //     //   }
  //     // } catch (e) {
  //     //   throw new UnauthorizedException(
  //     //     constants.default.errorMessages.UNAUTHORIZED_SOCIAL,
  //     //   );
  //     // }
  //   }
  //   private async verifyKakao(
  //     pId: string,
  //     oauthAccessToken: string,
  //   ): Promise<void> {
  //     try {
  //       const response = await axios({
  //         url: 'https://kapi.kakao.com/v1/user/access_token_info',
  //         method: 'get',
  //         headers: {
  //           Authorization: 'Bearer ' + oauthAccessToken,
  //         },
  //       });
  //       if (pId + '' !== response.data.id + '') {
  //         ceb.throwUnauthorizedException(
  //           constants.default.errorMessages.UNAUTHORIZED_SOCIAL,
  //         );
  //       }
  //     } catch (e) {
  //       ceb.throwUnauthorizedException(
  //         constants.default.errorMessages.UNAUTHORIZED_SOCIAL,
  //       );
  //     }
  //   }
  //   private async verifyNaver(
  //     pId: string,
  //     oauthAccessToken: string,
  //   ): Promise<void> {
  //     try {
  //       const response = await axios({
  //         url: 'https://openapi.naver.com/v1/nid/me',
  //         headers: {
  //           Authorization: 'Bearer ' + oauthAccessToken,
  //         },
  //         method: 'get',
  //       });
  //       if (
  //         !response.data ||
  //         response.data.resultcode !== '00' ||
  //         !response.data.response ||
  //         pId + '' !== response.data.response.id + ''
  //       ) {
  //         ceb.throwUnauthorizedException(
  //           constants.default.errorMessages.UNAUTHORIZED_SOCIAL,
  //         );
  //       }
  //     } catch (e) {
  //       ceb.throwUnauthorizedException(
  //         constants.default.errorMessages.UNAUTHORIZED_SOCIAL,
  //       );
  //     }
  //   }
}
