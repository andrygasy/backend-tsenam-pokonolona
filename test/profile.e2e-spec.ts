import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ProfileModule (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should require auth', () => {
    return request(app.getHttpServer()).get('/api/profile').expect(401);
  });

  it('should get and update profile', async () => {
    const email = 'profile@example.com';
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'password' })
      .expect(201);
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'password' })
      .expect(201);
    token = res.body.access_token;

    const getRes = await request(app.getHttpServer())
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(getRes.body.email).toBe(email);

    const updateRes = await request(app.getHttpServer())
      .put('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Name' })
      .expect(200);
    expect(updateRes.body.name).toBe('New Name');
  });

  it('should fail validation', async () => {
    const res = await request(app.getHttpServer())
      .put('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ phone: 'invalid' })
      .expect(422);
    expect(res.body.message).toBeDefined();
  });
});
