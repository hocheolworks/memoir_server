import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ThirdPartyErrorLog } from './entities/third-party-logger.entity';
import { GenerateThirdPartyErrorLogDto } from './dtos/generate-third-party-error-log.dto';
import { AxiosError, isAxiosError } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ThirdPartyLoggerService {
  constructor(
    @InjectRepository(ThirdPartyErrorLog)
    private readonly errorLogRepository: Repository<ThirdPartyErrorLog>,
  ) {}

  async createThirdPartyErrorLog(errorObject: AxiosError) {
    const generateThirdPartyErrorLogDto = new GenerateThirdPartyErrorLogDto();

    if (isAxiosError(errorObject)) {
      generateThirdPartyErrorLogDto.method = errorObject.request.method;
      generateThirdPartyErrorLogDto.requestBody = errorObject.config.data;
      generateThirdPartyErrorLogDto.requestUrl =
        errorObject.request.host + errorObject.request.path;
      generateThirdPartyErrorLogDto.statusCode = errorObject.response.status;

      if (typeof errorObject.response.data === 'object') {
        generateThirdPartyErrorLogDto.responseBody = JSON.stringify(
          errorObject.response.data,
        );
      } else {
        generateThirdPartyErrorLogDto.responseBody =
          errorObject.response.data.toString();
      }
    } else {
    }

    const insertResult = await this.errorLogRepository.insert(
      generateThirdPartyErrorLogDto,
    );

    return insertResult;
  }
}
