import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { loggerProviders } from './logger.provider';
import { LoggerService } from './logger.service';
import { thirdPartyloggerProviders } from './third-party-logger.provider';
import { ThirdPartyLoggerService } from './third-party-logger.service';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [
    ...loggerProviders,
    ...thirdPartyloggerProviders,
    LoggerService,
    ThirdPartyLoggerService,
  ],
  exports: [LoggerService, ThirdPartyLoggerService],
})
export class LoggerModule {}
