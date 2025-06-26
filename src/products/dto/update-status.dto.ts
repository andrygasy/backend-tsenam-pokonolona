import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProductStatus } from '../product.entity';

export class UpdateStatusDto {
  @IsEnum(['active', 'inactive', 'pending'])
  status: ProductStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}
