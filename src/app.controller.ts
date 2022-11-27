import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, // private authService: AuthService,
  ) {}

  // @UseGuards(LocalAuthGuard)
  // @Post('auth/login')
  // async login(@Request() req) {
  //   return this.authService.login(req.user);
  // }

  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('temp')
  getHello2(): string {
    return this.appService.getHello();
  }
}
