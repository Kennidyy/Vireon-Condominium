import { Module } from '@nestjs/common';
import { IdentityController } from './controllers/identity.controller';
import { PrismaModule } from '../../../../infrastructure/database/prisma/prisma.module';
import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';
import { PrismaUserRepository } from '../../infrastructure/database/prisma/PrismaUserRepository';
import { Argon2PasswordHasher } from '../../infrastructure/crypto/Argon2PasswordHasher';

@Module({
  imports: [PrismaModule],
  controllers: [IdentityController],
  providers: [
    CreateUserUseCase,
    PrismaUserRepository,
    Argon2PasswordHasher,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'PasswordHasher',
      useClass: Argon2PasswordHasher,
    },
  ],
})
export class IdentityModule {}
