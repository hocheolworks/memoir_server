import constants from 'src/common/common.constants';
import { DataSource } from 'typeorm';
import { ErrorLog } from './entities/logger.entity';

export const loggerProviders = [
  {
    provide: constants.dataBaseProviders.ERROR_LOG,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ErrorLog),
    inject: [constants.dataBaseProviders.DATA_SOURCE],
  },
];
