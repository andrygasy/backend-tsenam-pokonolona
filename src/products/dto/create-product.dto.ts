import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../product.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images?: string[];

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @IsEnum(['active', 'inactive', 'pending'])
  @IsOptional()
  status?: ProductStatus;
}
