import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../../orders/order.entity';

export class UpdateOrderStatusDto {
  @IsEnum(['pending', 'paid', 'shipped', 'delivered'])
  status: OrderStatus;

  @IsOptional()
  @IsString()
  trackingNumber?: string;
}
