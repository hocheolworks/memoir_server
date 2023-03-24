import constants from 'src/common/common.constants';
import { DataSource } from 'typeorm';
import { ThirdPartyErrorLog } from './entities/third-party-logger.entity';

export const thirdPartyloggerProviders = [
  {
    provide: constants.dataBaseProviders.THIRD_PARTY_ERROR_LOG,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ThirdPartyErrorLog),
    inject: [constants.dataBaseProviders.DATA_SOURCE],
  },
];
