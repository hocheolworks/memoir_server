/* eslint-disable @typescript-eslint/ban-types */
import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

function ValidationControllerAndSwageer(options: CustomControllerOption) {
  return function (target: Function) {
    Controller(options.apiPath)(target);
    ApiTags(options.swaggerTag)(target);
    UsePipes(ValidationPipe)(target);
  };
}

interface CustomControllerOption {
  apiPath: string | string[];
  swaggerTag: string;
}

export { ValidationControllerAndSwageer };
