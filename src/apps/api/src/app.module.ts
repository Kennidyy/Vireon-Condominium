import { Module } from '@nestjs/common';
import { IdentityModule } from './modules/identity/presentation/nestjs/identity.module';

@Module({
  imports: [IdentityModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
