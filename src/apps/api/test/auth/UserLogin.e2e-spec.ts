import { INestApplication } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import request from 'supertest';
import { TestDatabase } from '../utils/database';
import { bearer, createTestApp, loginRequest } from '../utils/test-app';

describe('Auth E2E User', () => {
  let app: INestApplication;
  let database: TestDatabase;
  let admin: { id: string; email: string; password: string };
  let adminToken: string;
  let user: { id: string; email: string; password: string };
  const createdUserIds: string[] = [];

  beforeAll(async () => {
    database = new TestDatabase();
    admin = await database.createUser(UserRole.ADMIN);
    app = await createTestApp();

    const adminLogin = await loginRequest(
      app,
      admin.email,
      admin.password,
    ).expect(200);
    adminToken = adminLogin.body.accessToken;

    const userEmail = `user-${crypto.randomUUID()}@vireon.test`;
    const userPassword = 'StrongPass@123';

    await request(app.getHttpServer())
      .post('/identity/users')
      .set(bearer(adminToken))
      .send({ email: userEmail, password: userPassword })
      .expect(201);

    const userByEmail = await request(app.getHttpServer())
      .get(`/identity/users?email=${encodeURIComponent(userEmail)}`)
      .set(bearer(adminToken))
      .expect(200);

    user = {
      id: userByEmail.body.id,
      email: userEmail,
      password: userPassword,
    };
  });

  afterAll(async () => {
    await app.close();
    for (const id of createdUserIds) {
      await database.deleteUser(id);
    }
    await database.deleteUser(`${user?.id}`);
    await database.deleteUser(admin.id);
    await database.disconnect();
  });

  it('should login a USER-role account and return an access token', async () => {
    const response = await loginRequest(app, user.email, user.password).expect(
      200,
    );

    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });
    expect(response.body.accessToken).not.toHaveLength(0);
  });

  it('should reject an unknown email', async () => {
    const response = await loginRequest(
      app,
      'unknown@vireon.test',
      'StrongPass@123',
    ).expect(401);

    expect(response.body).toEqual(
      expect.objectContaining({
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
        message: 'Email or password are wrong',
      }),
    );
    expect(response.body.path).toBe('/auth/login');
    expect(response.body.requestId).toEqual(expect.any(String));
  });

  it('should reject a wrong password', async () => {
    const response = await loginRequest(
      app,
      user.email,
      'WrongPass@999',
    ).expect(401);

    expect(response.body).toEqual(
      expect.objectContaining({
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
        message: 'Email or password are wrong',
      }),
    );
    expect(response.body.path).toBe('/auth/login');
    expect(response.body.requestId).toEqual(expect.any(String));
  });

  it('should reject a malformed email', async () => {
    const response = await loginRequest(
      app,
      'not-an-email',
      user.password,
    ).expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([expect.stringContaining('email')]),
    );
  });

  it('should reject a missing password', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email })
      .expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([expect.stringContaining('password')]),
    );
  });

  it('should reject a missing email', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ password: user.password })
      .expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([expect.stringContaining('email')]),
    );
  });

  it('should reject non-whitelisted fields', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password, extra: 'field' })
      .expect(400);

    expect(response.body.statusCode).toBe(400);
  });

  it('should return 401 (not 500) for a user whose stored hash is corrupted', async () => {
    const corrupt = await database.createUserWithCorruptedHash(UserRole.USER);
    createdUserIds.push(corrupt.id);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: corrupt.email, password: corrupt.password })
      .expect(401);

    expect(response.body).toEqual(
      expect.objectContaining({
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
        message: 'Email or password are wrong',
      }),
    );
    expect(response.body.path).toBe('/auth/login');
    expect(response.body.requestId).toEqual(expect.any(String));
  });

  it('should reject authorization headers from leaking on invalid login', async () => {
    const corrupt = await database.createUserWithCorruptedHash(UserRole.USER);
    createdUserIds.push(corrupt.id);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: corrupt.email, password: corrupt.password })
      .expect(401);

    expect(response.body).not.toHaveProperty('stack');
    expect(response.body).not.toHaveProperty('password');
    expect(JSON.stringify(response.body)).not.toContain('argon2');
  });
});
