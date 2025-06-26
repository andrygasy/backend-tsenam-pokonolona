import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('professional')
@Controller('api/professional/products')
export class ProfessionalProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateProductDto) {
    return this.productsService.create({ ...dto, userId: req.user['id'] } as any);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get()
  findMine(@Req() req: Request, @Query() query: QueryProductsDto) {
    return this.productsService.findAllByUser(req.user['id'], query);
  }
}
