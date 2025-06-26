import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalRequest } from './professional-request.entity';
import { ProfessionalService } from './professional.service';
import { ProfessionalController } from './professional.controller';
import { Product } from '../products/product.entity';
import { Service } from '../services/service.entity';
import { Order } from '../orders/order.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalRequest, Product, Service, Order]), AuthModule],
  providers: [ProfessionalService],
  controllers: [ProfessionalController],
})
export class ProfessionalModule {}
