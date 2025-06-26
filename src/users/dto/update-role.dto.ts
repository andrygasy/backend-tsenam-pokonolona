import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../user.entity';

export class UpdateRoleDto {
  @IsIn(['user', 'professional', 'admin'])
  role: UserRole;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];
}
