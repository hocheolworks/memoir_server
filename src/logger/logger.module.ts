import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { loggerProviders } from './logger.provider';
import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [...loggerProviders, LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
