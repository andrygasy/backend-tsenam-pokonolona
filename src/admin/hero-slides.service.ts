import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeroSlide } from './hero-slide.entity';
import { CreateHeroSlideDto } from './dto/create-hero-slide.dto';
import { UpdateHeroSlideDto } from './dto/update-hero-slide.dto';

@Injectable()
export class HeroSlidesService {
  constructor(
    @InjectRepository(HeroSlide)
    private slidesRepository: Repository<HeroSlide>,
  ) {}

  create(dto: CreateHeroSlideDto) {
    const slide = this.slidesRepository.create(dto);
    return this.slidesRepository.save(slide);
  }

  findAll() {
    return this.slidesRepository.find();
  }

  async findOne(id: string) {
    const slide = await this.slidesRepository.findOne({ where: { id } });
    if (!slide) throw new NotFoundException('Slide not found');
    return slide;
  }

  async update(id: string, dto: UpdateHeroSlideDto) {
    const slide = await this.findOne(id);
    Object.assign(slide, dto);
    return this.slidesRepository.save(slide);
  }

  async remove(id: string) {
    const slide = await this.findOne(id);
    await this.slidesRepository.remove(slide);
    return { message: 'Slide deleted' };
  }
}
