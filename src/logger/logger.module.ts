import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorLog } from './entities/logger.entity';
import { ThirdPartyErrorLog } from './entities/third-party-logger.entity';
import { LoggerService } from './logger.service';
import { ThirdPartyLoggerService } from './third-party-logger.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ErrorLog, ThirdPartyErrorLog])],
  providers: [LoggerService, ThirdPartyLoggerService],
  exports: [LoggerService, ThirdPartyLoggerService],
})
export class LoggerModule {}
