import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroSlide } from './hero-slide.entity';
import { Promotion } from './promotion.entity';
import { HeroSlidesService } from './hero-slides.service';
import { PromotionsService } from './promotions.service';
import { HeroSlidesController } from './hero-slides.controller';
import { PromotionsController } from './promotions.controller';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';
import { ProfessionalRequest } from '../professional/professional-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HeroSlide, Promotion, User, Order, Product, ProfessionalRequest]),
  ],
  controllers: [HeroSlidesController, PromotionsController, DashboardController],
  providers: [HeroSlidesService, PromotionsService, DashboardService],
})
export class AdminModule {}
