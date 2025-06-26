import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { QueryPromotionsDto } from './dto/query-promotions.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionsRepository: Repository<Promotion>,
  ) {}

  async findAll(query: QueryPromotionsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const [items, total] = await this.promotionsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      promotions: items,
      pagination: { total, page, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const promo = await this.promotionsRepository.findOne({ where: { id } });
    if (!promo) throw new NotFoundException('Promotion not found');
    return promo;
  }

  async create(dto: CreatePromotionDto) {
    const promo = this.promotionsRepository.create({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
    return this.promotionsRepository.save(promo);
  }

  async update(id: string, dto: UpdatePromotionDto) {
    const promo = await this.findOne(id);
    Object.assign(promo, {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : promo.startDate,
      endDate: dto.endDate ? new Date(dto.endDate) : promo.endDate,
    });
    return this.promotionsRepository.save(promo);
  }

  async remove(id: string) {
    const promo = await this.findOne(id);
    await this.promotionsRepository.remove(promo);
    return { message: 'Promotion deleted' };
  }
}
