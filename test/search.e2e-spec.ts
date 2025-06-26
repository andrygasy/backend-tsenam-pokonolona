import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../src/products/product.entity';
import { Service } from '../src/services/service.entity';

describe('SearchModule (e2e)', () => {
  let app: INestApplication;
  let productsRepo: Repository<Product>;
  let servicesRepo: Repository<Service>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    productsRepo = moduleFixture.get<Repository<Product>>(getRepositoryToken(Product));
    servicesRepo = moduleFixture.get<Repository<Service>>(getRepositoryToken(Service));
    await app.init();
  });

  afterEach(async () => {
    await productsRepo.clear();
    await servicesRepo.clear();
  });

  it('basic search', async () => {
    await productsRepo.save(productsRepo.create({ name: 'SearchProd', description: 'desc', price: 1, stock: 1 } as any));
    await servicesRepo.save(servicesRepo.create({ name: 'SearchServ', description: 'desc', price: 1 } as any));

    const res = await request(app.getHttpServer()).get('/api/search').query({ q: 'Search' }).expect(200);
    expect(res.body.products.length).toBeGreaterThan(0);
    expect(res.body.services.length).toBeGreaterThan(0);
    expect(res.body.pagination.total).toBeGreaterThan(0);
  });

  it('missing q', () => {
    return request(app.getHttpServer()).get('/api/search').expect(400);
  });

  it('filter by type', async () => {
    await productsRepo.save(productsRepo.create({ name: 'OnlyProd', description: 'desc', price: 1, stock: 1 } as any));
    await servicesRepo.save(servicesRepo.create({ name: 'OnlyServ', description: 'desc', price: 1 } as any));

    const res = await request(app.getHttpServer())
      .get('/api/search')
      .query({ q: 'Only', type: 'products' })
      .expect(200);
    expect(res.body.products.length).toBe(1);
    expect(res.body.services.length).toBe(0);
  });

  it('pagination', async () => {
    for (let i = 0; i < 5; i++) {
      await productsRepo.save(productsRepo.create({ name: `Prod ${i}`, description: 'd', price: 1, stock: 1 } as any));
    }

    const res = await request(app.getHttpServer())
      .get('/api/search')
      .query({ q: 'Prod', type: 'products', page: 2, limit: 2 })
      .expect(200);
    expect(res.body.products.length).toBe(2);
    expect(res.body.pagination.page).toBe(2);
    expect(res.body.pagination.limit).toBe(2);
  });

  it('server error', async () => {
    const spy = jest.spyOn(productsRepo, 'createQueryBuilder').mockImplementation(() => {
      throw new Error('fail');
    });
    await request(app.getHttpServer()).get('/api/search').query({ q: 'x' }).expect(500);
    spy.mockRestore();
  });
});
