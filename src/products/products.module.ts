import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { PublicProductsController } from './public-products.controller';
import { ProfessionalProductsController } from './professional-products.controller';
import { AdminProductsController } from './admin-products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [PublicProductsController, ProfessionalProductsController, AdminProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
