import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AxiosResponse } from 'axios';
import constants from '../common.constants';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GithubUserGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException(constants.errorMessages.NEED_TOKEN);
    }

    const headers = {
      accept: 'application/json',
      Authorization: token,
    };

    let getUserInfoResult: AxiosResponse;

    try {
      getUserInfoResult = await firstValueFrom(
        this.httpService.get(`https://api.github.com/user`, { headers }),
      );
    } catch (e) {
      throw new BadRequestException(constants.errorMessages.INVALID_TOKEN);
    }

    return true;
  }
}
