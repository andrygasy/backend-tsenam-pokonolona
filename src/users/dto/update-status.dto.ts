import { IsIn, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '../user.entity';

export class UpdateStatusDto {
  @IsIn(['active', 'suspended', 'pending'])
  status: UserStatus;

  @IsString()
  @IsOptional()
  reason?: string;
}
