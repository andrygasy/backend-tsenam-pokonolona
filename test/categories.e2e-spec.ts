import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

describe('CategoriesModule (e2e)', () => {
  let app: INestApplication;
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

  it('admin endpoints', async () => {
    const email = 'catadmin@example.com';
    const user = await usersService.create({ email, password: 'password' } as any);
    user.role = 'admin';
    await usersService['usersRepository'].save(user);
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'password' })
      .expect(201);
    adminToken = res.body.access_token;

    const createRes = await request(app.getHttpServer())
      .post('/api/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Cat1' })
      .expect(201);
    const id = createRes.body.id;

    await request(app.getHttpServer())
      .put(`/api/admin/categories/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ description: 'Desc' })
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/categories/${id}`)
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/categories')
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/categories/tree')
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/api/admin/categories/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('should fail without auth on admin routes', () => {
    return request(app.getHttpServer())
      .post('/api/admin/categories')
      .send({ name: 'Fail' })
      .expect(401);
  });
});
