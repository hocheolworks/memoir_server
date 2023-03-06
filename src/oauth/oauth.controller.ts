import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { OAuthService } from './oauth.service';

@ApiTags('OAuth')
@Controller('oauth')
export class OAuthController {
  constructor(private oauthService: OAuthService) {}

  @Get('test')
  async tempLoginPage(@Res() res: Response) {
    res.sendFile('index.html', {
      root: 'public',
    });
  }
}
