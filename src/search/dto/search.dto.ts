import { IsNotEmpty, IsOptional, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchDto {
  @IsNotEmpty()
  q: string;

  @IsOptional()
  @IsIn(['products', 'services', 'all'])
  type?: 'products' | 'services' | 'all';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
