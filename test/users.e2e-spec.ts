import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

describe('UsersModule (e2e)', () => {
  let app: INestApplication;
  let token: string;
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

  it('profile endpoints', async () => {
    const email = 'user1@example.com';
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'password' })
      .expect(201);
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'password' })
      .expect(201);
    token = res.body.access_token;

    await request(app.getHttpServer())
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .put('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test User' })
      .expect(200);
  });

  it('admin endpoints', async () => {
    const email = 'admin@example.com';
    const user = await usersService.create({ email, password: 'password' } as any);
    user.role = 'admin';
    await usersService['usersRepository'].save(user);
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'password' })
      .expect(201);
    adminToken = res.body.access_token;

    await request(app.getHttpServer())
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
