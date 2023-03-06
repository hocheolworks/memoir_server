import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as constants from '../../common.constants';

export const GetSession = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const { session } = request;

    if (!session) {
      throw new BadRequestException(
        constants.default.errorMessages.UNAUTHORIZED_USER,
      );
    }

    return session;
  },
);
