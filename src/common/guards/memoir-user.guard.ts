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
import { AxiosResponse, isAxiosError } from 'axios';
import constants from '../common.constants';
import { firstValueFrom } from 'rxjs';
import { UserInfoDto } from '../dtos/userInfo.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { ThirdPartyLoggerService } from 'src/logger/third-party-logger.service';

@Injectable()
export class MemoirUserGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly thirdPartyLoggerService: ThirdPartyLoggerService,
  ) {}

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
      await this.thirdPartyLoggerService.createThirdPartyErrorLog(e);

      throw new BadRequestException(constants.errorMessages.INVALID_TOKEN);
    }

    const userInfo = new UserInfoDto();

    userInfo.githubUserName = getUserInfoResult.data.login;
    userInfo.description = getUserInfoResult.data.bio;
    userInfo.profileImage = getUserInfoResult.data.avatar_url;

    let memoirUser: User;
    try {
      memoirUser = await this.userService.findUserByGithubUserName(
        userInfo.githubUserName,
      );
    } catch (error) {
      throw new NotFoundException(constants.errorMessages.USER_NOT_FOUND);
    }
    memoirUser.accesstoken = request.headers.authorization;

    request['userInfo'] = { ...userInfo, ...memoirUser };

    return true;
  }
}
