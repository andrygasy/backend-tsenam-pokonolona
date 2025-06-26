import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { Service } from '../services/service.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async search(
    query: string,
    type: 'products' | 'services' | 'all' = 'all',
    page = 1,
    limit = 10,
  ) {
    const q = query.trim();
    if (!q) throw new BadRequestException('Query cannot be empty');
    const offset = (page - 1) * limit;

    const products: Product[] = [];
    const services: Service[] = [];
    let total = 0;

    if (type === 'products' || type === 'all') {
      const qb = this.productsRepository.createQueryBuilder('product');
      qb.where(
        "to_tsvector('simple', product.name || ' ' || product.description) @@ plainto_tsquery(:q)",
        { q },
      );
      qb.skip(offset).take(limit);
      const [items, count] = await qb.getManyAndCount();
      products.push(...items);
      total += count;
    }

    if (type === 'services' || type === 'all') {
      const qb = this.servicesRepository.createQueryBuilder('service');
      qb.where(
        "to_tsvector('simple', service.name || ' ' || service.description) @@ plainto_tsquery(:q)",
        { q },
      );
      qb.skip(offset).take(limit);
      const [items, count] = await qb.getManyAndCount();
      services.push(...items);
      total += count;
    }

    return { items: { products, services }, total, page, limit };
  }
}
