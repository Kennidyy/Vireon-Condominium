import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'node:http';
import { AppModule } from '../src/app.module';

describe('Identity API (e2e)', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /identity/login', () => {
    it('should return 400 on invalid email', () => {
      return request(server)
        .post('/identity/login')
        .send({ email: 'invalid', password: 'Short1!' })
        .expect(400);
    });

    it('should return 400 on short password', () => {
      return request(server)
        .post('/identity/login')
        .send({ email: 'valid@email.com', password: 'Short1!' })
        .expect(400);
    });

    it('should return 400 on missing fields', () => {
      return request(server).post('/identity/login').send({}).expect(400);
    });
  });

  describe('POST /identity/users', () => {
    it('should return 401 without token', () => {
      return request(server)
        .post('/identity/users')
        .send({ email: 'admin@test.com', password: 'StrongPass123!' })
        .expect(401);
    });
  });

  describe('GET /identity/all', () => {
    it('should return 401 without token', () => {
      return request(server).get('/identity/all').expect(401);
    });
  });

  describe('GET /identity/me', () => {
    it('should return 401 without token', () => {
      return request(server).get('/identity/me').expect(401);
    });
  });
});
