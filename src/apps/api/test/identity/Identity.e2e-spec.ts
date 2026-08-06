import { INestApplication } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import request from 'supertest';
import { TestDatabase, TestUser } from '../utils/database';
import { bearer, createTestApp, loginRequest } from '../utils/test-app';

describe('Identity E2E', () => {
  let app: INestApplication;
  let database: TestDatabase;
  let admin: TestUser;
  let adminToken: string;
  const createdUserIds: string[] = [];

  async function createUserViaApi(): Promise<TestUser> {
    const email = `identity-${crypto.randomUUID()}@vireon.test`;
    const password = 'StrongPass@123';

    await request(app.getHttpServer())
      .post('/identity/users')
      .set(bearer(adminToken))
      .send({ email, password })
      .expect(201);

    const userByEmail = await request(app.getHttpServer())
      .get(`/identity/users?email=${encodeURIComponent(email)}`)
      .set(bearer(adminToken))
      .expect(200);

    const user: TestUser = { id: userByEmail.body.id, email, password };
    createdUserIds.push(user.id);

    return user;
  }

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
  });

  afterAll(async () => {
    await app.close();
    for (const id of createdUserIds) {
      await database.deleteUser(id);
    }
    await database.deleteUser(admin.id);
    await database.disconnect();
  });

  it('should create a USER-role user', async () => {
    const email = `created-${crypto.randomUUID()}@vireon.test`;
    const password = 'StrongPass@123';

    const response = await request(app.getHttpServer())
      .post('/identity/users')
      .set(bearer(adminToken))
      .send({ email, password })
      .expect(201);

    expect(response.body).toEqual({});

    const userByEmail = await request(app.getHttpServer())
      .get(`/identity/users?email=${encodeURIComponent(email)}`)
      .set(bearer(adminToken))
      .expect(200);

    expect(userByEmail.body).toEqual({ id: expect.any(String), email });

    createdUserIds.push(userByEmail.body.id);
  });

  it('should reject a duplicate email', async () => {
    const user = await createUserViaApi();

    const response = await request(app.getHttpServer())
      .post('/identity/users')
      .set(bearer(adminToken))
      .send({ email: user.email, password: user.password })
      .expect(409);

    expect(response.body).toEqual({
      statusCode: 409,
      code: 'EMAIL_ALREADY_IN_USE',
      message: 'This email is already in use',
    });
  });

  it('should reject a malformed email', async () => {
    const response = await request(app.getHttpServer())
      .post('/identity/users')
      .set(bearer(adminToken))
      .send({ email: 'not-an-email', password: 'StrongPass@123' })
      .expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([expect.stringContaining('email')]),
    );
  });

  it('should reject a short password', async () => {
    const response = await request(app.getHttpServer())
      .post('/identity/users')
      .set(bearer(adminToken))
      .send({
        email: `short-${crypto.randomUUID()}@vireon.test`,
        password: 'short',
      })
      .expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([expect.stringContaining('password')]),
    );
  });

  it('should reject a password that violates domain rules', async () => {
    const response = await request(app.getHttpServer())
      .post('/identity/users')
      .set(bearer(adminToken))
      .send({
        email: `weak-${crypto.randomUUID()}@vireon.test`,
        password: 'aaaaaaaaaa',
      })
      .expect(400);

    expect(response.body.statusCode).toBe(400);
  });

  it('should reject non-whitelisted fields', async () => {
    const response = await request(app.getHttpServer())
      .post('/identity/users')
      .set(bearer(adminToken))
      .send({
        email: `extra-${crypto.randomUUID()}@vireon.test`,
        password: 'StrongPass@123',
        extra: 'field',
      })
      .expect(400);

    expect(response.body.statusCode).toBe(400);
  });

  it('should require authentication to create a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/identity/users')
      .send({
        email: `no-auth-${crypto.randomUUID()}@vireon.test`,
        password: 'StrongPass@123',
      })
      .expect(401);

    expect(response.body.statusCode).toBe(401);
  });

  it('should forbid a USER-role account from creating users', async () => {
    const user = await createUserViaApi();
    const userLogin = await loginRequest(app, user.email, user.password).expect(
      200,
    );
    const userToken = userLogin.body.accessToken;

    const response = await request(app.getHttpServer())
      .post('/identity/users')
      .set(bearer(userToken))
      .send({
        email: `forbidden-${crypto.randomUUID()}@vireon.test`,
        password: 'StrongPass@123',
      })
      .expect(403);

    expect(response.body.statusCode).toBe(403);
  });

  it('should return a user by email', async () => {
    const user = await createUserViaApi();

    const response = await request(app.getHttpServer())
      .get(`/identity/users?email=${encodeURIComponent(user.email)}`)
      .set(bearer(adminToken))
      .expect(200);

    expect(response.body).toEqual({ id: user.id, email: user.email });
  });

  it('should reject an unknown email lookup', async () => {
    const response = await request(app.getHttpServer())
      .get(`/identity/users?email=${encodeURIComponent('missing@vireon.test')}`)
      .set(bearer(adminToken))
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      code: 'USER_NOT_FOUND',
      message: 'User not found',
    });
  });

  it('should return a user by id', async () => {
    const user = await createUserViaApi();

    const response = await request(app.getHttpServer())
      .get(`/identity/users/${user.id}`)
      .set(bearer(adminToken))
      .expect(200);

    expect(response.body).toEqual({ id: user.id, email: user.email });
  });

  it('should reject an unknown id lookup', async () => {
    const response = await request(app.getHttpServer())
      .get(`/identity/users/${crypto.randomUUID()}`)
      .set(bearer(adminToken))
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      code: 'USER_NOT_FOUND',
      message: 'User not found',
    });
  });

  it('should list all users', async () => {
    const user = await createUserViaApi();

    const response = await request(app.getHttpServer())
      .get('/identity/all')
      .set(bearer(adminToken))
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: admin.id, email: admin.email }),
        expect.objectContaining({ id: user.id, email: user.email }),
      ]),
    );
  });

  it('should return the authenticated subject on /identity/me', async () => {
    const adminMe = await request(app.getHttpServer())
      .get('/identity/me')
      .set(bearer(adminToken))
      .expect(200);

    expect(adminMe.body).toEqual({ id: admin.id, role: 'ADMIN' });

    const user = await createUserViaApi();
    const userLogin = await loginRequest(app, user.email, user.password).expect(
      200,
    );

    const userMe = await request(app.getHttpServer())
      .get('/identity/me')
      .set(bearer(userLogin.body.accessToken))
      .expect(200);

    expect(userMe.body).toEqual({ id: user.id, role: 'USER' });
  });

  it('should require authentication on /identity/me', async () => {
    const response = await request(app.getHttpServer())
      .get('/identity/me')
      .expect(401);

    expect(response.body.statusCode).toBe(401);
  });

  it('should update a user email', async () => {
    const user = await createUserViaApi();
    const newEmail = `renamed-${crypto.randomUUID()}@vireon.test`;

    await request(app.getHttpServer())
      .patch(`/identity/users/${user.id}`)
      .set(bearer(adminToken))
      .send({ email: newEmail })
      .expect(200);

    const userByNewEmail = await request(app.getHttpServer())
      .get(`/identity/users?email=${encodeURIComponent(newEmail)}`)
      .set(bearer(adminToken))
      .expect(200);

    expect(userByNewEmail.body).toEqual({ id: user.id, email: newEmail });

    const oldEmailLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(401);

    expect(oldEmailLogin.body.statusCode).toBe(401);
  });

  it('should update a user password', async () => {
    const user = await createUserViaApi();
    const newPassword = 'NewPass@456';

    await request(app.getHttpServer())
      .patch(`/identity/users/${user.id}`)
      .set(bearer(adminToken))
      .send({ password: newPassword })
      .expect(200);

    const oldPasswordLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(401);

    expect(oldPasswordLogin.body.statusCode).toBe(401);

    const newPasswordLogin = await loginRequest(
      app,
      user.email,
      newPassword,
    ).expect(200);

    expect(newPasswordLogin.body).toEqual({ accessToken: expect.any(String) });
  });

  it('should update a user role', async () => {
    const user = await createUserViaApi();

    await request(app.getHttpServer())
      .patch(`/identity/users/${user.id}`)
      .set(bearer(adminToken))
      .send({ role: 'ADMIN' })
      .expect(200);

    const userLogin = await loginRequest(app, user.email, user.password).expect(
      200,
    );

    const userMe = await request(app.getHttpServer())
      .get('/identity/me')
      .set(bearer(userLogin.body.accessToken))
      .expect(200);

    expect(userMe.body).toEqual({ id: user.id, role: 'ADMIN' });
  });

  it('should reject updating an unknown user', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/identity/users/${crypto.randomUUID()}`)
      .set(bearer(adminToken))
      .send({ email: 'anyone@vireon.test' })
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      code: 'USER_NOT_FOUND',
      message: 'User not found',
    });
  });

  it('should delete a user', async () => {
    const user = await createUserViaApi();

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/identity/users/${user.id}`)
      .set(bearer(adminToken))
      .expect(200);

    expect(deleteResponse.body).toEqual({});

    const userById = await request(app.getHttpServer())
      .get(`/identity/users/${user.id}`)
      .set(bearer(adminToken))
      .expect(404);

    expect(userById.body.code).toBe('USER_NOT_FOUND');

    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(401);

    expect(userLogin.body.statusCode).toBe(401);
  });

  it('should reject deleting an unknown user', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/identity/users/${crypto.randomUUID()}`)
      .set(bearer(adminToken))
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      code: 'USER_NOT_FOUND',
      message: 'User not found',
    });
  });
});
