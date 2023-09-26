import { PickType } from '@nestjs/swagger';
import { User } from '../user.entity';

export class ModifyUserDto extends PickType(User, ['blogIntroduction']) {}
