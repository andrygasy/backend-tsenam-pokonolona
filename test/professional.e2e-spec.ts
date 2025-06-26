import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { OrdersService } from '../src/orders/orders.service';

describe('ProfessionalModule (e2e)', () => {
  let app: INestApplication;
  let professionalToken: string;
  let usersService: UsersService;
  let ordersService: OrdersService;
  let orderId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersService = moduleFixture.get(UsersService);
    ordersService = moduleFixture.get(OrdersService);
    await app.init();
  });

  it('setup professional user', async () => {
    const email = 'proreq@example.com';
    const user = await usersService.create({ email, password: 'pass' } as any);
    user.role = 'professional';
    await usersService['usersRepository'].save(user);
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'pass' })
      .expect(201);
    professionalToken = res.body.access_token;
  });

  it('request professional status', async () => {
    await request(app.getHttpServer())
      .post('/api/professional/request')
      .set('Authorization', `Bearer ${professionalToken}`)
      .send({
        companyName: 'Comp',
        accountType: 'seller',
        description: 'desc',
        email: 'contact@example.com',
      })
      .expect(201);
  });

  it('products, services and orders', async () => {
    await request(app.getHttpServer())
      .get('/api/professional/products')
      .set('Authorization', `Bearer ${professionalToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/professional/services')
      .set('Authorization', `Bearer ${professionalToken}`)
      .expect(200);

    const order = await ordersService.createOrder(userId(professionalToken), {
      items: [{ productId: '11111111-1111-1111-1111-111111111111', quantity: 1, price: 5 }],
    } as any);
    orderId = order.id;

    await request(app.getHttpServer())
      .get('/api/professional/orders')
      .set('Authorization', `Bearer ${professionalToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .put(`/api/professional/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${professionalToken}`)
      .send({ status: 'shipped' })
      .expect(200);
  });

  it('should fail unauthorized', () => {
    return request(app.getHttpServer()).get('/api/professional/products').expect(401);
  });

  it('should forbid non professional', async () => {
    const email = 'regularpro@example.com';
    await usersService.create({ email, password: 'pass' } as any);
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'pass' })
      .expect(201);
    const token = res.body.access_token;
    await request(app.getHttpServer())
      .get('/api/professional/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('should return 400 on bad request', async () => {
    await request(app.getHttpServer())
      .post('/api/professional/request')
      .set('Authorization', `Bearer ${professionalToken}`)
      .send({})
      .expect(400);
  });

  it('should return 404 for unknown order', () => {
    return request(app.getHttpServer())
      .put('/api/professional/orders/unknown/status')
      .set('Authorization', `Bearer ${professionalToken}`)
      .send({ status: 'paid' })
      .expect(404);
  });
});

function userId(token: string): any {
  // simple helper to decode payload { sub: id }
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  return payload.sub;
}
