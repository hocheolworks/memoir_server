import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { getClientIp } from 'request-ip';

export const GetIp = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const ip = getClientIp(request);

    return ip;
  },
);
