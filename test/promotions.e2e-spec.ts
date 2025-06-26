import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

describe('PromotionsModule (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let usersService: UsersService;
  let promoId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersService = moduleFixture.get(UsersService);
    await app.init();
  });

  it('setup users', async () => {
    const adminEmail = 'promoadmin@example.com';
    const admin = await usersService.create({ email: adminEmail, password: 'pass' } as any);
    admin.role = 'admin';
    await usersService['usersRepository'].save(admin);
    const resAdmin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminEmail, password: 'pass' })
      .expect(201);
    adminToken = resAdmin.body.access_token;

    const userEmail = 'promouser@example.com';
    await usersService.create({ email: userEmail, password: 'pass' } as any);
    const resUser = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userEmail, password: 'pass' })
      .expect(201);
    userToken = resUser.body.access_token;
  });

  it('CRUD operations', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/api/admin/promotions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Promo',
        discountType: 'percentage',
        discountValue: 20,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isActive: true,
      })
      .expect(201);
    promoId = createRes.body.id;

    await request(app.getHttpServer())
      .get('/api/admin/promotions')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/admin/promotions/${promoId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .put(`/api/admin/promotions/${promoId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false })
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/api/admin/promotions/${promoId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/admin/promotions/${promoId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('validation and auth errors', async () => {
    await request(app.getHttpServer())
      .post('/api/admin/promotions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({})
      .expect(422);

    await request(app.getHttpServer())
      .post('/api/admin/promotions')
      .expect(401);

    await request(app.getHttpServer())
      .get('/api/admin/promotions')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});
