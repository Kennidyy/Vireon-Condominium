import { INestApplication } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import request from 'supertest';
import { TestDatabase, TestUser } from '../utils/database';
import { bearer, createTestApp, loginRequest } from '../utils/test-app';

interface TestSession extends TestUser {
  token: string;
}

describe('Resident E2E', () => {
  let app: INestApplication;
  let database: TestDatabase;
  let admin: TestUser;
  let adminToken: string;
  const createdUserIds: string[] = [];

  async function createUser(): Promise<TestSession> {
    const email = `resident-${crypto.randomUUID()}@vireon.test`;
    const password = 'StrongPass@123';

    await request(app.getHttpServer())
      .post('/identity/users')
      .set(bearer(adminToken))
      .send({ email, password })
      .expect(201);

    const login = await loginRequest(app, email, password).expect(200);
    const me = await request(app.getHttpServer())
      .get('/identity/me')
      .set(bearer(login.body.accessToken))
      .expect(200);

    const user: TestSession = {
      id: me.body.id,
      email,
      password,
      token: login.body.accessToken,
    };
    createdUserIds.push(user.id);

    return user;
  }

  async function createUserAndResident(name: string): Promise<TestSession> {
    const user = await createUser();

    await request(app.getHttpServer())
      .post('/residents')
      .set(bearer(user.token))
      .send({ name })
      .expect(201);

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

  describe('create and rename', () => {
    it('should create a resident for the authenticated user', async () => {
      const user = await createUser();
      const userLogin = await loginRequest(
        app,
        user.email,
        user.password,
      ).expect(200);

      await request(app.getHttpServer())
        .post('/residents')
        .set(bearer(userLogin.body.accessToken))
        .send({ name: 'Joao Silva' })
        .expect(201);
    });

    it('should reject creating a second resident for the same user', async () => {
      const user = await createUserAndResident('Maria Souza');

      const response = await request(app.getHttpServer())
        .post('/residents')
        .set(bearer(user.token))
        .send({ name: 'Maria Souza' })
        .expect(409);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 409,
          code: 'RESIDENT_ALREADY_EXISTS',
          message: 'Resident already exists',
        }),
      );
      expect(response.body.path).toBe('/residents');
      expect(response.body.requestId).toEqual(expect.any(String));
    });

    it('should reject an empty name', async () => {
      const user = await createUser();

      const response = await request(app.getHttpServer())
        .post('/residents')
        .set(bearer(user.token))
        .send({ name: '' })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });

    it('should reject an invalid name', async () => {
      const user = await createUser();

      const response = await request(app.getHttpServer())
        .post('/residents')
        .set(bearer(user.token))
        .send({ name: 'Joao@Silva' })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });

    it('should reject non-whitelisted fields', async () => {
      const user = await createUser();

      const response = await request(app.getHttpServer())
        .post('/residents')
        .set(bearer(user.token))
        .send({ name: 'Joao Silva', extra: 'field' })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });

    it('should require authentication to create a resident', async () => {
      const response = await request(app.getHttpServer())
        .post('/residents')
        .send({ name: 'Joao Silva' })
        .expect(401);

      expect(response.body.statusCode).toBe(401);
    });

    it('should rename the authenticated user’s resident', async () => {
      const user = await createUserAndResident('Joao Silva');

      await request(app.getHttpServer())
        .patch('/residents')
        .set(bearer(user.token))
        .send({ name: 'Joao Pedro' })
        .expect(200);

      const search = await request(app.getHttpServer())
        .get(`/residents/search?name=${encodeURIComponent('Joao Pedro')}`)
        .expect(200);

      expect(search.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: user.id, name: 'Joao Pedro' }),
        ]),
      );
    });
  });

  describe('public search', () => {
    it('should search residents by a name fragment case-insensitively', async () => {
      const user = await createUserAndResident('Ana Beatriz');

      const response = await request(app.getHttpServer())
        .get(`/residents/search?name=${encodeURIComponent('ana beatriz')}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: user.id, name: 'Ana Beatriz' }),
        ]),
      );
    });

    it('should reject a search without matches', async () => {
      const response = await request(app.getHttpServer())
        .get(`/residents/search?name=${encodeURIComponent('inexistent-name')}`)
        .expect(404);

      expect(response.body.statusCode).toBe(404);
    });

    it('should reject a search without a name', async () => {
      const response = await request(app.getHttpServer())
        .get('/residents/search')
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });

    it('should reject a search with a whitespace-only name', async () => {
      const response = await request(app.getHttpServer())
        .get('/residents/search')
        .query({ name: '   ' })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });

    it('should reject unexpected query parameters', async () => {
      const response = await request(app.getHttpServer())
        .get('/residents/search')
        .query({ name: 'João', unknown: 'value' })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });
  });

  describe('admin operations', () => {
    it('should list every resident as admin', async () => {
      const user = await createUserAndResident('Carlos Pereira');

      const response = await request(app.getHttpServer())
        .get('/residents')
        .set(bearer(adminToken))
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: user.id, name: 'Carlos Pereira' }),
        ]),
      );
    });

    it('should forbid a USER-role account from listing residents', async () => {
      const user = await createUserAndResident('Marcos Lima');

      const response = await request(app.getHttpServer())
        .get('/residents')
        .set(bearer(user.token))
        .expect(403);

      expect(response.body.statusCode).toBe(403);
    });

    it('should require authentication to list residents', async () => {
      const response = await request(app.getHttpServer())
        .get('/residents')
        .expect(401);

      expect(response.body.statusCode).toBe(401);
    });

    it('should return a resident by id as admin', async () => {
      const user = await createUserAndResident('Patricia Rocha');

      const response = await request(app.getHttpServer())
        .get(`/residents/${user.id}`)
        .set(bearer(adminToken))
        .expect(200);

      expect(response.body).toEqual({
        id: user.id,
        name: 'Patricia Rocha',
        profilePhoto: 'defaults/profile.jpg',
        contacts: [],
      });
    });

    it('should forbid a USER-role account from reading a resident by id', async () => {
      const user = await createUserAndResident('Rodrigo Alves');

      const response = await request(app.getHttpServer())
        .get(`/residents/${user.id}`)
        .set(bearer(user.token))
        .expect(403);

      expect(response.body.statusCode).toBe(403);
    });

    it('should reject a missing resident lookup', async () => {
      const response = await request(app.getHttpServer())
        .get(`/residents/${crypto.randomUUID()}`)
        .set(bearer(adminToken))
        .expect(404);

      expect(response.body.statusCode).toBe(404);
    });

    it('should delete a resident as admin', async () => {
      const user = await createUserAndResident('Fernanda Dias');

      await request(app.getHttpServer())
        .delete(`/residents/${user.id}`)
        .set(bearer(adminToken))
        .expect(200);

      const lookup = await request(app.getHttpServer())
        .get(`/residents/${user.id}`)
        .set(bearer(adminToken))
        .expect(404);

      expect(lookup.body.statusCode).toBe(404);
    });
  });

  describe('profile photo', () => {
    it('should update the profile-photo metadata as admin', async () => {
      const user = await createUserAndResident('Bruno Campos');

      const response = await request(app.getHttpServer())
        .patch(`/residents/${user.id}/photo`)
        .set(bearer(adminToken))
        .send({
          storageKey: 'uploads/avatar.png',
          contentType: 'image/png',
          size: 1024,
        })
        .expect(200);

      expect(response.body.profilePhoto).toBe('uploads/avatar.png');
    });

    it('should reject an invalid photo content type', async () => {
      const user = await createUserAndResident('Lucas Nunes');

      const response = await request(app.getHttpServer())
        .patch(`/residents/${user.id}/photo`)
        .set(bearer(adminToken))
        .send({
          storageKey: 'uploads/avatar.gif',
          contentType: 'GIF',
          size: 1024,
        })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });

    it('should reject a photo that exceeds the size limit', async () => {
      const user = await createUserAndResident('Larissa Melo');

      const response = await request(app.getHttpServer())
        .patch(`/residents/${user.id}/photo`)
        .set(bearer(adminToken))
        .send({
          storageKey: 'uploads/avatar.png',
          contentType: 'image/png',
          size: 6 * 1024 * 1024,
        })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });

    it('should forbid a USER-role account from updating the photo', async () => {
      const user = await createUserAndResident('Paulo Teixeira');

      const response = await request(app.getHttpServer())
        .patch(`/residents/${user.id}/photo`)
        .set(bearer(user.token))
        .send({
          storageKey: 'uploads/avatar.png',
          contentType: 'PNG',
          size: 1024,
        })
        .expect(403);

      expect(response.body.statusCode).toBe(403);
    });
  });

  describe('contacts', () => {
    it('should add an email contact', async () => {
      const user = await createUserAndResident('Joao Silva');

      const response = await request(app.getHttpServer())
        .post(`/residents/${user.id}/contacts`)
        .set(bearer(user.token))
        .send({ type: 'EMAIL', value: 'joao@example.com' })
        .expect(201);

      expect(response.body.contacts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'EMAIL', value: 'joao@example.com' }),
        ]),
      );
    });

    it('should add a phone contact', async () => {
      const user = await createUserAndResident('Mateus Barbosa');

      const response = await request(app.getHttpServer())
        .post(`/residents/${user.id}/contacts`)
        .set(bearer(user.token))
        .send({ type: 'PHONE', value: '+5511987654321' })
        .expect(201);

      expect(response.body.contacts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'PHONE', value: '+5511987654321' }),
        ]),
      );
    });

    it('should reject an invalid email contact', async () => {
      const user = await createUserAndResident('Vera Cardoso');

      const response = await request(app.getHttpServer())
        .post(`/residents/${user.id}/contacts`)
        .set(bearer(user.token))
        .send({ type: 'EMAIL', value: 'not-an-email' })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });

    it('should reject an invalid phone contact', async () => {
      const user = await createUserAndResident('Vera Cardoso');

      const response = await request(app.getHttpServer())
        .post(`/residents/${user.id}/contacts`)
        .set(bearer(user.token))
        .send({ type: 'PHONE', value: '11987654321' })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });

    it('should update a contact value', async () => {
      const user = await createUserAndResident('Hugo Martins');

      const added = await request(app.getHttpServer())
        .post(`/residents/${user.id}/contacts`)
        .set(bearer(user.token))
        .send({ type: 'EMAIL', value: 'hugo@example.com' })
        .expect(201);

      const contactId = added.body.contacts[0].id;

      const response = await request(app.getHttpServer())
        .patch(`/residents/${user.id}/contacts/${contactId}`)
        .set(bearer(user.token))
        .send({ value: 'hugo.novo@example.com' })
        .expect(200);

      expect(response.body.contacts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: contactId,
            value: 'hugo.novo@example.com',
          }),
        ]),
      );
    });

    it('should reject an invalid contact value on update', async () => {
      const user = await createUserAndResident('Tais Fontes');

      const added = await request(app.getHttpServer())
        .post(`/residents/${user.id}/contacts`)
        .set(bearer(user.token))
        .send({ type: 'EMAIL', value: 'tais@example.com' })
        .expect(201);

      const contactId = added.body.contacts[0].id;

      const response = await request(app.getHttpServer())
        .patch(`/residents/${user.id}/contacts/${contactId}`)
        .set(bearer(user.token))
        .send({ value: 'not-an-email' })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });

    it('should set a primary contact', async () => {
      const user = await createUserAndResident('Caio Duarte');

      const first = await request(app.getHttpServer())
        .post(`/residents/${user.id}/contacts`)
        .set(bearer(user.token))
        .send({ type: 'EMAIL', value: 'caio@example.com' })
        .expect(201);
      const second = await request(app.getHttpServer())
        .post(`/residents/${user.id}/contacts`)
        .set(bearer(user.token))
        .send({ type: 'PHONE', value: '+5511987654321' })
        .expect(201);

      const primaryContactId = first.body.contacts[0].id;
      const otherContactId = second.body.contacts[1].id;

      const response = await request(app.getHttpServer())
        .patch(`/residents/${user.id}/contacts/${primaryContactId}/primary`)
        .set(bearer(user.token))
        .expect(200);

      const byId = (id: string) =>
        (response.body.contacts as { id: string; isPrimary: boolean }[]).find(
          (c) => c.id === id,
        );

      expect(byId(primaryContactId)?.isPrimary).toBe(true);
      expect(byId(otherContactId)?.isPrimary).toBe(false);
    });

    it('should reject setting an unknown contact as primary', async () => {
      const user = await createUserAndResident('Davi Rocha');

      const response = await request(app.getHttpServer())
        .patch(`/residents/${user.id}/contacts/${crypto.randomUUID()}/primary`)
        .set(bearer(user.token))
        .expect(404);

      expect(response.body.statusCode).toBe(404);
    });

    it('should remove a contact', async () => {
      const user = await createUserAndResident('Vitor Castro');

      const added = await request(app.getHttpServer())
        .post(`/residents/${user.id}/contacts`)
        .set(bearer(user.token))
        .send({ type: 'EMAIL', value: 'vitor@example.com' })
        .expect(201);

      const contactId = added.body.contacts[0].id;

      const response = await request(app.getHttpServer())
        .delete(`/residents/${user.id}/contacts/${contactId}`)
        .set(bearer(user.token))
        .expect(200);

      expect(response.body.contacts).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ id: contactId })]),
      );
    });

    it('should enforce the ten-contact limit', async () => {
      const user = await createUserAndResident('Rafa Almeida');

      for (let i = 1; i <= 10; i++) {
        await request(app.getHttpServer())
          .post(`/residents/${user.id}/contacts`)
          .set(bearer(user.token))
          .send({ type: 'EMAIL', value: `contato${i}@example.com` })
          .expect(201);
      }

      const eleventh = await request(app.getHttpServer())
        .post(`/residents/${user.id}/contacts`)
        .set(bearer(user.token))
        .send({ type: 'EMAIL', value: 'contato11@example.com' })
        .expect(400);

      expect(eleventh.body.statusCode).toBe(400);
    });

    it('should allow an admin to mutate any resident’s contacts', async () => {
      const user = await createUserAndResident('Admin Ownership');

      await request(app.getHttpServer())
        .post(`/residents/${user.id}/contacts`)
        .set(bearer(adminToken))
        .send({ type: 'EMAIL', value: 'admin-added@example.com' })
        .expect(201);
    });

    it('should require authentication on contact routes', async () => {
      const response = await request(app.getHttpServer())
        .post(`/residents/${crypto.randomUUID()}/contacts`)
        .send({ type: 'EMAIL', value: 'no-auth@example.com' })
        .expect(401);

      expect(response.body.statusCode).toBe(401);
    });
  });

  describe('ownership enforcement', () => {
    it('should forbid a USER-role account from adding a contact to another user’s resident', async () => {
      const owner = await createUserAndResident('Owner Contato');
      const attacker = await createUser();

      const response = await request(app.getHttpServer())
        .post(`/residents/${owner.id}/contacts`)
        .set(bearer(attacker.token))
        .send({ type: 'EMAIL', value: 'interferencia@example.com' })
        .expect(403);

      expect(response.body.statusCode).toBe(403);
    });

    it('should forbid a USER-role account from updating a contact on another user’s resident', async () => {
      const owner = await createUserAndResident('Owner Update');
      const attacker = await createUser();

      const added = await request(app.getHttpServer())
        .post(`/residents/${owner.id}/contacts`)
        .set(bearer(owner.token))
        .send({ type: 'EMAIL', value: 'owner@example.com' })
        .expect(201);

      const contactId = added.body.contacts[0].id;

      const response = await request(app.getHttpServer())
        .patch(`/residents/${owner.id}/contacts/${contactId}`)
        .set(bearer(attacker.token))
        .send({ value: 'invadido@example.com' })
        .expect(403);

      expect(response.body.statusCode).toBe(403);
    });

    it('should forbid a USER-role account from removing a contact on another user’s resident', async () => {
      const owner = await createUserAndResident('Owner Remove');
      const attacker = await createUser();

      const added = await request(app.getHttpServer())
        .post(`/residents/${owner.id}/contacts`)
        .set(bearer(owner.token))
        .send({ type: 'EMAIL', value: 'owner-remove@example.com' })
        .expect(201);

      const contactId = added.body.contacts[0].id;

      const response = await request(app.getHttpServer())
        .delete(`/residents/${owner.id}/contacts/${contactId}`)
        .set(bearer(attacker.token))
        .expect(403);

      expect(response.body.statusCode).toBe(403);
    });

    it('should preserve the contact after a denied cross-user mutation', async () => {
      const owner = await createUserAndResident('Owner Persist');
      const attacker = await createUser();

      const added = await request(app.getHttpServer())
        .post(`/residents/${owner.id}/contacts`)
        .set(bearer(owner.token))
        .send({ type: 'EMAIL', value: 'preservar@example.com' })
        .expect(201);

      const contactId = added.body.contacts[0].id;

      await request(app.getHttpServer())
        .patch(`/residents/${owner.id}/contacts/${contactId}`)
        .set(bearer(attacker.token))
        .send({ value: 'tentativa@example.com' })
        .expect(403);

      const after = await request(app.getHttpServer())
        .get(`/residents/${owner.id}`)
        .set(bearer(adminToken))
        .expect(200);

      expect(after.body.contacts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: contactId,
            value: 'preservar@example.com',
          }),
        ]),
      );
    });
  });
});
