import { IsEnum } from 'class-validator';
import { OrderStatus } from '../order.entity';

export class UpdateStatusDto {
  @IsEnum(['pending', 'paid', 'shipped', 'delivered'])
  status: OrderStatus;
}
