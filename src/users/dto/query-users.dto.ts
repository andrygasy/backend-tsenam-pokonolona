import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole, UserStatus } from '../user.entity';

export class QueryUsersDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;

  @IsIn(['user', 'professional', 'admin'])
  @IsOptional()
  role?: UserRole;

  @IsIn(['active', 'suspended', 'pending'])
  @IsOptional()
  status?: UserStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
