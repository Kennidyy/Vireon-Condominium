import { Module } from '@nestjs/common';
import { IdentityController } from './controllers/identity.controller';
import { PrismaModule } from '../../../../infrastructure/database/prisma/prisma.module';
import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';
import { PrismaUserRepository } from '../../infrastructure/database/prisma/PrismaUserRepository';
import { Argon2PasswordHasher } from '../../infrastructure/crypto/Argon2PasswordHasher';
import { GetUserByEmailUseCase } from '../../application/use-cases/GetUserByEmailUseCase';
import { GetUserByIdUseCase } from '../../application/use-cases/GetUserByIdUseCase';

@Module({
  imports: [PrismaModule],
  controllers: [IdentityController],
  providers: [
    CreateUserUseCase,
    GetUserByEmailUseCase,
    GetUserByIdUseCase,
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
