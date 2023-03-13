import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { GenerateErrorLogDto } from './dtos/generate-error-log.dto';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: Function) {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', async () => {
      const statusCode = response.statusCode;

      let requestBody: string = '';
      if (statusCode >= 400 && statusCode !== 404) {
        this.logger.error(
          `${method} ${originalUrl} ${statusCode} - ${userAgent} ${ip}`,
        );
        if (Object.keys(request.body).length !== 0) {
          requestBody = request.body;
          this.logger.error(`request body : ${JSON.stringify(request.body)}`);
        }

        const generateErrorLogDto = new GenerateErrorLogDto();

        generateErrorLogDto.ip = ip;
        generateErrorLogDto.method = method;
        generateErrorLogDto.originalUrl = originalUrl;
        generateErrorLogDto.statusCode = statusCode;
        generateErrorLogDto.userAgent = userAgent;
        generateErrorLogDto.requestBody = requestBody;

        await this.loggerService.createErrorLog(generateErrorLogDto);
      } else {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} - ${userAgent} ${ip}`,
        );
      }
    });

    next();
  }
}
