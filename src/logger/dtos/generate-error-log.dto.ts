import { ApiProperty } from '@nestjs/swagger';
import { ErrorLog } from '../logger.entity';

export class GenerateErrorLogDto extends ErrorLog {}
