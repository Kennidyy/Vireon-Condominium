import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../utils/test-app';

describe('OpenAPI Swagger', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should serve the Swagger UI on GET /docs', async () => {
    const response = await request(app.getHttpServer())
      .get('/docs')
      .expect(200);

    expect(response.text).toContain('swagger-ui');
  });

  it('should expose an OpenAPI JSON document with the expected paths', async () => {
    const response = await request(app.getHttpServer())
      .get('/docs-json')
      .expect(200);

    expect(response.body.info.title).toBe('Vireon Condominium API');
    expect(response.body.info.version).toBe('0.3.0');
    expect(response.body.paths['/auth/login']).toBeDefined();
    expect(response.body.paths['/identity/users']).toBeDefined();
    expect(response.body.paths['/residents']).toBeDefined();
  });
});
