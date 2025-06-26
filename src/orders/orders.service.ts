import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryAdminOrdersDto, QueryOrdersDto } from './dto/query-orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async createOrder(userId: number, dto: CreateOrderDto) {
    const total = dto.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = this.ordersRepository.create({
      userId,
      items: dto.items,
      total,
      status: 'pending',
    });
    return this.ordersRepository.save(order);
  }

  async findAllByUser(userId: number, query: QueryOrdersDto) {
    const qb = this.ordersRepository.createQueryBuilder('order');
    qb.where('order.userId = :uid', { uid: userId });
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    qb.skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { orders: items, pagination: { total, page, totalPages: Math.ceil(total / limit) } };
  }

  async findAllAdmin(query: QueryAdminOrdersDto) {
    const qb = this.ordersRepository.createQueryBuilder('order');
    if (query.status) qb.where('order.status = :status', { status: query.status });
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    qb.skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { orders: items, pagination: { total, page, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    return this.ordersRepository.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    return this.ordersRepository.save(order);
  }
}
