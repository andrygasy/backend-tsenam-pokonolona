import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoriesService } from './categories.service';
import { PublicCategoriesController } from './public-categories.controller';
import { AdminCategoriesController } from './admin-categories.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule],
  providers: [CategoriesService],
  controllers: [PublicCategoriesController, AdminCategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
