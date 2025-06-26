import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionsRepository: Repository<Promotion>,
  ) {}

  create(dto: CreatePromotionDto) {
    const promo = this.promotionsRepository.create(dto);
    return this.promotionsRepository.save(promo);
  }

  findAll() {
    return this.promotionsRepository.find();
  }

  async findOne(id: string) {
    const promo = await this.promotionsRepository.findOne({ where: { id } });
    if (!promo) throw new NotFoundException('Promotion not found');
    return promo;
  }

  async update(id: string, dto: UpdatePromotionDto) {
    const promo = await this.findOne(id);
    Object.assign(promo, dto);
    return this.promotionsRepository.save(promo);
  }

  async remove(id: string) {
    const promo = await this.findOne(id);
    await this.promotionsRepository.remove(promo);
    return { message: 'Promotion deleted' };
  }
}
