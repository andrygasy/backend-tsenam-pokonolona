import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { User } from './users/user.entity';
import { Category } from './categories/category.entity';
import { Product } from './products/product.entity';
import { Service } from './services/service.entity';
import { ProductsModule } from './products/products.module';
import { Order } from './orders/order.entity';
import { OrdersModule } from './orders/orders.module';
import { ProfileModule } from './profile/profile.module';
import { SearchModule } from './search/search.module';
import { ProfessionalRequest } from './professional/professional-request.entity';
import { ProfessionalModule } from './professional/professional.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Category, Product, Service, Order, ProfessionalRequest],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    ProfileModule,
    SearchModule,
    ProfessionalModule,
  ],
})
export class AppModule {}
