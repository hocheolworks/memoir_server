import { Inject, Injectable, LoggerService as LS } from '@nestjs/common';
import * as winston from 'winston';
import moment from 'moment';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import constants from 'src/common/common.constants';
import { Repository } from 'typeorm';
import { ErrorLog } from './entities/logger.entity';
import { GenerateErrorLogDto } from './dtos/generate-error-log.dto';
import { InjectRepository } from '@nestjs/typeorm';

const { errors, combine, timestamp, printf } = winston.format;

@Injectable()
export class LoggerService implements LS {
  private logger: winston.Logger;

  constructor(
    @InjectRepository(ErrorLog)
    private readonly errorLogRepository: Repository<ErrorLog>,
  ) {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.File({
          level: 'error',
          filename: `error-${moment(new Date()).format('YYYY-MM-DD')}.log`,
          dirname: 'logs',
          maxsize: 5000000,
          format: combine(
            errors({ stack: true }),
            timestamp({ format: 'isoDateTime' }),
            printf((info) => {
              return `${info.message}`;
            }),
          ),
        }),
        new winston.transports.Console({
          level: 'debug',
          format: combine(
            timestamp({ format: 'isoDateTime' }),
            nestWinstonModuleUtilities.format.nestLike('memoir', {
              prettyPrint: true,
            }),
          ),
        }),

        new winston.transports.File({
          filename: `application-${moment(new Date()).format(
            'YYYY-MM-DD',
          )}.log`,
          dirname: 'logs',
          maxsize: 5000000,
          format: combine(
            timestamp({ format: 'isoDateTime' }),
            printf((info) => {
              return `${info.message}`;
            }),
          ),
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.log({ level: 'info', message });
  }
  info(message: string) {
    this.logger.info(message);
  }
  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }
  warn(message: string) {
    this.logger.warning(message);
  }
  debug(message: string) {
    this.logger.debug(message);
  }
  verbose(message: string) {
    this.logger.verbose(message);
  }

  async createErrorLog(generateErrorLogDto: GenerateErrorLogDto) {
    const insertResult = await this.errorLogRepository.insert(
      generateErrorLogDto,
    );

    return insertResult;
  }
}
