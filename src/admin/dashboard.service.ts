import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';
import { ProfessionalRequest } from '../professional/professional-request.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
    @InjectRepository(Product) private productsRepo: Repository<Product>,
    @InjectRepository(ProfessionalRequest) private requestsRepo: Repository<ProfessionalRequest>,
  ) {}

  async getStats() {
    const totalUsers = await this.usersRepo.count();
    const totalOrders = await this.ordersRepo.count();
    const { sum } = await this.ordersRepo
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'sum')
      .getRawOne<{ sum: string }>();
    const totalRevenue = Number(sum) || 0;
    const activeProducts = await this.productsRepo.count({ where: { status: 'active' } });
    const pendingRequests = await this.requestsRepo.count({ where: { status: 'pending' } });
    return { totalUsers, totalOrders, totalRevenue, activeProducts, pendingRequests };
  }
}
