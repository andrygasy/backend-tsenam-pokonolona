import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, IsArray, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { DiscountType, PromotionConditions } from '../promotion.entity';

class ConditionsDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  minAmount?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  maxUsage?: number;
}

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DiscountType)
  @IsNotEmpty()
  discountType: DiscountType;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  discountValue: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ValidateNested()
  @Type(() => ConditionsDto)
  @IsOptional()
  conditions?: PromotionConditions;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
