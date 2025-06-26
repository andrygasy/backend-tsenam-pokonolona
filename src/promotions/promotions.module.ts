import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './promotion.entity';
import { PromotionsService } from './promotions.service';
import { AdminPromotionsController } from './admin-promotions.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion]), AuthModule],
  providers: [PromotionsService],
  controllers: [AdminPromotionsController],
  exports: [PromotionsService],
})
export class PromotionsModule {}
