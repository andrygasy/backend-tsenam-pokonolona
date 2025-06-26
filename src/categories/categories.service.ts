import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoriesDto } from './dto/query-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create({
      name: dto.name,
      description: dto.description,
      parentId: dto.parentId ?? null,
    });
    return this.categoriesRepository.save(category);
  }

  async findAll(query: QueryCategoriesDto) {
    const qb = this.categoriesRepository.createQueryBuilder('category');
    qb.where('category.deletedAt IS NULL');
    if (query.search) {
      qb.andWhere('category.name ILIKE :search', { search: `%${query.search}%` });
    }
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return {
      categories: items,
      pagination: { total, page, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<Category | null> {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    if (dto.name !== undefined) category.name = dto.name;
    if (dto.description !== undefined) category.description = dto.description;
    if (dto.parentId !== undefined) category.parentId = dto.parentId;
    return this.categoriesRepository.save(category);
  }

  async remove(id: string, softDelete = true) {
    if (softDelete) {
      await this.categoriesRepository.softDelete(id);
    } else {
      await this.categoriesRepository.delete(id);
    }
  }

  async findTree() {
    const categories = await this.categoriesRepository.find({
      where: { deletedAt: IsNull() },
    });
    const map = new Map<string, Category & { children: Category[] }>();
    categories.forEach(c => map.set(c.id, { ...c, children: [] }));
    const roots: (Category & { children: Category[] })[] = [];
    map.forEach(cat => {
      if (cat.parentId) {
        const parent = map.get(cat.parentId);
        if (parent) parent.children.push(cat);
      } else {
        roots.push(cat);
      }
    });
    return roots;
  }
}
