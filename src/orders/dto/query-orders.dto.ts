import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../order.entity';

export class QueryOrdersDto {
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

export class QueryAdminOrdersDto extends QueryOrdersDto {
  @IsOptional()
  @IsIn(['pending', 'paid', 'shipped', 'delivered'])
  status?: OrderStatus;
}
