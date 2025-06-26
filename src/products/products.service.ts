import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAllPublic(query: QueryProductsDto) {
    const qb = this.productsRepository.createQueryBuilder('product');
    qb.where('product.status = :status', { status: 'active' });
    if (query.categoryId) qb.andWhere('product.categoryId = :cat', { cat: query.categoryId });
    if (query.search) {
      qb.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', { search: `%${query.search}%` });
    }
    if (query.minPrice !== undefined)
      qb.andWhere('product.price >= :min', { min: query.minPrice });
    if (query.maxPrice !== undefined)
      qb.andWhere('product.price <= :max', { max: query.maxPrice });
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    qb.skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { products: items, pagination: { total, page, totalPages: Math.ceil(total / limit) } };
  }

  async findAllByUser(userId: number, query: QueryProductsDto) {
    const qb = this.productsRepository.createQueryBuilder('product');
    qb.where('product.userId = :uid', { uid: userId });
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    qb.skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { products: items, pagination: { total, page, totalPages: Math.ceil(total / limit) } };
  }

  async findAllAdmin(query: QueryProductsDto & { status?: ProductStatus; userId?: number }) {
    const qb = this.productsRepository.createQueryBuilder('product');
    if (query.status) qb.where('product.status = :status', { status: query.status });
    if (query.categoryId) qb.andWhere('product.categoryId = :cat', { cat: query.categoryId });
    if (query.userId !== undefined) qb.andWhere('product.userId = :uid', { uid: query.userId });
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    qb.skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { products: items, pagination: { total, page, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productsRepository.findOne({ where: { id } });
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      categoryId: dto.categoryId ?? null,
      userId: (dto as any).userId ?? null,
      images: dto.images ?? [],
      stock: dto.stock,
      status: dto.status ?? 'pending',
    });
    return this.productsRepository.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Product not found');
    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.categoryId !== undefined) product.categoryId = dto.categoryId;
    if ((dto as any).userId !== undefined) product.userId = (dto as any).userId;
    if (dto.images !== undefined) product.images = dto.images;
    if (dto.stock !== undefined) product.stock = dto.stock;
    if (dto.status !== undefined) product.status = dto.status;
    return this.productsRepository.save(product);
  }

  async remove(id: string) {
    await this.productsRepository.delete(id);
  }

  async updateStatus(id: string, status: ProductStatus) {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Product not found');
    product.status = status;
    return this.productsRepository.save(product);
  }
}
