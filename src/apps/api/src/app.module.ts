import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IdentityModule } from './modules/identity/presentation/nestjs/identity.module';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import { ResidentModule } from './modules/resident/presentation/nestjs/resident.module';
import { AuthModule } from './modules/auth/presentation/auth.module';
import { JwtStrategy } from './modules/auth/infrastructure/strategy/JwtStrategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig],
    }),
    IdentityModule,
    ResidentModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
