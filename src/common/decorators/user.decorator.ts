import { createParamDecorator } from '@nestjs/common';

export const GetUserInfo = createParamDecorator((data, ctx) => {
  const req = ctx.switchToHttp().getRequest();

  return req['userInfo'];
});
