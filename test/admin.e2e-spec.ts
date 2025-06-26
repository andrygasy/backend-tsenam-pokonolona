import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

describe('AdminModule (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersService = moduleFixture.get(UsersService);
    await app.init();
  });

  it('setup users', async () => {
    const email = 'adminhs@example.com';
    const user = await usersService.create({ email, password: 'pass' } as any);
    user.role = 'admin';
    await usersService['usersRepository'].save(user);
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'pass' })
      .expect(201);
    adminToken = res.body.access_token;

    const userEmail = 'user@example.com';
    await usersService.create({ email: userEmail, password: 'pass' } as any);
    const res2 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userEmail, password: 'pass' })
      .expect(201);
    userToken = res2.body.access_token;
  });

  it('hero slides CRUD', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/api/admin/hero-slides')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Slide', image: 'http://example.com/img.jpg', order: 1 })
      .expect(201);
    const id = createRes.body.id;

    await request(app.getHttpServer())
      .get('/api/admin/hero-slides')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/admin/hero-slides/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .put(`/api/admin/hero-slides/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Updated' })
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/api/admin/hero-slides/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/admin/hero-slides/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('promotions CRUD', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/api/admin/promotions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Promo',
        discountType: 'percent',
        value: 10,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      })
      .expect(201);
    const id = createRes.body.id;
    await request(app.getHttpServer())
      .get('/api/admin/promotions')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .put(`/api/admin/promotions/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ active: false })
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/api/admin/promotions/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('forbidden for non admin', async () => {
    await request(app.getHttpServer())
      .get('/api/admin/hero-slides')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('unauthorized', async () => {
    await request(app.getHttpServer())
      .get('/api/admin/hero-slides')
      .expect(401);
  });
});
