import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalRequest } from './professional-request.entity';
import { RequestProfessionalDto } from './dto/request-professional.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Product } from '../products/product.entity';
import { Service as ServiceEntity } from '../services/service.entity';
import { Order } from '../orders/order.entity';

@Injectable()
export class ProfessionalService {
  constructor(
    @InjectRepository(ProfessionalRequest)
    private requestsRepository: Repository<ProfessionalRequest>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ServiceEntity)
    private servicesRepository: Repository<ServiceEntity>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async requestProfessional(userId: string, dto: RequestProfessionalDto) {
    const req = this.requestsRepository.create({
      userId,
      companyName: dto.companyName,
      accountType: dto.accountType,
      description: dto.description,
      status: 'pending',
    });
    return this.requestsRepository.save(req);
  }

  async findProProducts(userId: string, query: { page?: number; limit?: number }) {
    const qb = this.productsRepository.createQueryBuilder('product');
    qb.where('product.userId = :uid', { uid: userId });
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    qb.skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { products: items, pagination: { total, page, totalPages: Math.ceil(total / limit) } };
  }

  async findProServices(userId: string, query: { page?: number; limit?: number }) {
    const qb = this.servicesRepository.createQueryBuilder('service');
    qb.where('service.userId = :uid', { uid: userId });
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    qb.skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { services: items, pagination: { total, page, totalPages: Math.ceil(total / limit) } };
  }

  async findProOrders(userId: string, query: { status?: string; page?: number; limit?: number }) {
    const qb = this.ordersRepository.createQueryBuilder('order');
    qb.where('order.userId = :uid', { uid: userId });
    if (query.status) qb.andWhere('order.status = :status', { status: query.status });
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    qb.skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { orders: items, pagination: { total, page, totalPages: Math.ceil(total / limit) } };
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    order.status = dto.status;
    if (dto.trackingNumber !== undefined) order['trackingNumber'] = dto.trackingNumber;
    return this.ordersRepository.save(order);
  }
}
