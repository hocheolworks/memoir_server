import { ApiProperty } from '@nestjs/swagger';
import { ErrorLog } from '../entities/logger.entity';

export class GenerateErrorLogDto extends ErrorLog {}
