import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './modules/shared/presentation/filters/GlobalExceptionFilter';
import { setupOpenApi } from './modules/shared/presentation/swagger/setup-open-api';
import { assertConfig } from './config/bootstrap-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  const configService = app.get(ConfigService);
  assertConfig(configService);

  setupOpenApi(app);

  const port = configService.get<number>('app.port', 3000);

  await app.listen(port);
}
void bootstrap();
