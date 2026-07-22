import { Module } from '@nestjs/common';
import { IdentityController } from './controllers/identity.controller';

@Module({
  controllers: [IdentityController],
})
export class IdentityModule {}
