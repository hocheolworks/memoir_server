import {
  BadGatewayException,
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { OAuthService } from './oauth.service';

@ApiTags('OAuth')
@Controller('oauth')
export class OAuthController {
  constructor(private oauthService: OAuthService) {}

  @Get('test')
  async tempLoginPage(@Res() res: Response) {
    throw new BadGatewayException('test');
    res.sendFile('index.html', {
      root: 'public',
    });
  }

  @Post('temptemp')
  async postTest(@Body() body: string) {
    throw new ConflictException('tet');
    console.log(body);
  }
}
