import { Module } from '@nestjs/common';
import { IdentityModule } from './modules/identity/presentation/nestjs/identity.module';
import { JwtStrategy } from './modules/identity/infrastructure/auth/JwtStrategy';
import { JwtAuthGuard } from './modules/identity/infrastructure/auth/JwtAuthGuard';

@Module({
  imports: [IdentityModule],
  controllers: [],
  providers: [
    JwtStrategy,
    JwtAuthGuard
  ],
})
export class AppModule {}
