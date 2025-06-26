import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { CategoriesService } from '../src/categories/categories.service';

describe('ProductsModule (e2e)', () => {
  let app: INestApplication;
  let professionalToken: string;
  let adminToken: string;
  let usersService: UsersService;
  let categoriesService: CategoriesService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersService = moduleFixture.get(UsersService);
    categoriesService = moduleFixture.get(CategoriesService);
    await app.init();
  });

  it('setup users', async () => {
    const emailPro = 'pro@example.com';
    const pro = await usersService.create({ email: emailPro, password: 'pass' } as any);
    pro.role = 'professional';
    await usersService['usersRepository'].save(pro);
    const resPro = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: emailPro, password: 'pass' })
      .expect(201);
    professionalToken = resPro.body.access_token;

    const emailAdmin = 'admin2@example.com';
    const admin = await usersService.create({ email: emailAdmin, password: 'pass' } as any);
    admin.role = 'admin';
    await usersService['usersRepository'].save(admin);
    const resAdmin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: emailAdmin, password: 'pass' })
      .expect(201);
    adminToken = resAdmin.body.access_token;
  });

  it('professional product CRUD', async () => {
    const cat = await categoriesService.create({ name: 'ProdCat' });
    const createRes = await request(app.getHttpServer())
      .post('/api/professional/products')
      .set('Authorization', `Bearer ${professionalToken}`)
      .send({
        name: 'Prod1',
        description: 'desc',
        price: 10,
        categoryId: cat.id,
        stock: 5,
        status: 'active',
      })
      .expect(201);
    const id = createRes.body.id;

    await request(app.getHttpServer())
      .put(`/api/professional/products/${id}`)
      .set('Authorization', `Bearer ${professionalToken}`)
      .send({ price: 12 })
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/professional/products')
      .set('Authorization', `Bearer ${professionalToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/api/professional/products/${id}`)
      .set('Authorization', `Bearer ${professionalToken}`)
      .expect(200);
  });

  it('public and admin endpoints', async () => {
    await request(app.getHttpServer()).get('/api/products').expect(200);
    await request(app.getHttpServer())
      .get('/api/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('should fail without auth', () => {
    return request(app.getHttpServer())
      .post('/api/professional/products')
      .send({ name: 'Fail', description: 'x', price: 1, stock: 1 })
      .expect(401);
  });
});
