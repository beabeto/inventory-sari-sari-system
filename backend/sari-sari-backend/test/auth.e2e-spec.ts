jest.setTimeout(30000);

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    // ✅ Seed admin user
    const usersService = app.get(UsersService);
    const existing = await usersService.findOne('admin');
    if (!existing) {
      await usersService.create('admin', 'admin123');
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('login success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'admin123',
      })
      .expect(201); // ✅ MATCHES YOUR BACKEND

    expect(res.body).toHaveProperty('access_token');
    expect(typeof res.body.access_token).toBe('string');
  });

  it('login failure', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'wrongpassword',
      })
      .expect(401);
  });
});