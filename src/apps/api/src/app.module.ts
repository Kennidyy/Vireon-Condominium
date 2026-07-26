import { Module } from '@nestjs/common';
import { IdentityModule } from './modules/identity/presentation/nestjs/identity.module';
import { JwtStrategy } from './modules/identity/infrastructure/auth/JwtStrategy';
import { JwtAuthGuard } from './modules/identity/infrastructure/auth/JwtAuthGuard';
import { RolesGuard } from './modules/identity/infrastructure/auth/RolesGuard';

@Module({
  imports: [IdentityModule],
  controllers: [],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard
  ],
})
export class AppModule {}
