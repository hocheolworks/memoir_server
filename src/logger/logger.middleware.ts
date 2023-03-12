import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {}
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: Function) {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const statusCode = response.statusCode;
      console.log(request.body);

      if (statusCode > 400) {
        this.logger.error(
          `${method} ${originalUrl} ${statusCode} - ${userAgent} ${ip}`,
        );
        if (Object.keys(request.body).length !== 0) {
          this.logger.error(`request body : ${JSON.stringify(request.body)}`);
        }

        //TODO DB INSERT
        // this.logger.
      } else {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} - ${userAgent} ${ip}`,
        );
      }
    });

    // const loggerService = new LoggerService(
    //   req.url.slice(1).split('/')[req.url.slice(1).split('/').length - 1],
    // );
    // const tempUrl = req.method + ' ' + req.url.split('?')[0];
    // const _headers = req.headers ? req.headers : {};
    // const _query = req.query ? req.query : {};
    // const _body = req.body ? req.body : {};
    // const _url = tempUrl ? tempUrl : {};

    // console.log(res);

    // loggerService.info(
    //   JSON.stringify({
    //     url: _url,
    //     headers: _headers,
    //     query: _query,
    //     body: _body,
    //   }),
    // );

    next();
  }
}
