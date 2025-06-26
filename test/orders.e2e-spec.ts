import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

describe('OrdersModule (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
  let adminToken: string;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersService = moduleFixture.get(UsersService);
    await app.init();
  });

  it('order flow', async () => {
    const emailUser = 'orderuser@example.com';
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: emailUser, password: 'pass' })
      .expect(201);
    const resUser = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: emailUser, password: 'pass' })
      .expect(201);
    userToken = resUser.body.access_token;

    const createRes = await request(app.getHttpServer())
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        items: [
          {
            productId: '11111111-1111-1111-1111-111111111111',
            quantity: 2,
            price: 5,
          },
        ],
      })
      .expect(201);
    const id = createRes.body.id;

    await request(app.getHttpServer())
      .get('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/orders/${id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    const emailAdmin = 'orderadmin@example.com';
    const admin = await usersService.create({ email: emailAdmin, password: 'pass' } as any);
    admin.role = 'admin';
    await usersService['usersRepository'].save(admin);
    const resAdmin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: emailAdmin, password: 'pass' })
      .expect(201);
    adminToken = resAdmin.body.access_token;

    await request(app.getHttpServer())
      .get('/api/admin/orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .put(`/api/admin/orders/${id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'paid' })
      .expect(200);
  });

  it('should fail without auth', () => {
    return request(app.getHttpServer()).get('/api/orders').expect(401);
  });

  it('should forbid non admin', async () => {
    const email = 'regular@example.com';
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'pass' })
      .expect(201);
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'pass' })
      .expect(201);
    const token = res.body.access_token;
    await request(app.getHttpServer())
      .get('/api/admin/orders')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});
