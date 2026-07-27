import { Module } from '@nestjs/common';
import { IdentityController } from './controllers/identity.controller';
import { PrismaModule } from '../../../../infrastructure/database/prisma/prisma.module';
import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';
import { PrismaUserRepository } from '../../infrastructure/database/prisma/PrismaUserRepository';
import { Argon2PasswordHasher } from '../../infrastructure/crypto/Argon2PasswordHasher';
import { GetUserByEmailUseCase } from '../../application/use-cases/GetUserByEmailUseCase';
import { GetUserByIdUseCase } from '../../application/use-cases/GetUserByIdUseCase';
import { DeleteUserByIdUseCase } from '../../application/use-cases/DeleteUserByIdUseCase';
import { UpdateUserUseCase } from '../../application/use-cases/UpdateUserUseCase';
import { GetAllUsersUseCase } from '../../application/use-cases/GetAllUsersUseCase';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { JwtTokenSigner } from '../../infrastructure/auth/JwtTokenSigner';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../infrastructure/auth/JwtStrategy';

@Module({
  imports: [
    PrismaModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '15m',
      },
    }),
  ],
  controllers: [IdentityController],
  providers: [
    CreateUserUseCase,
    GetUserByEmailUseCase,
    GetUserByIdUseCase,
    DeleteUserByIdUseCase,
    UpdateUserUseCase,
    GetAllUsersUseCase,
    LoginUseCase,
    PrismaUserRepository,
    Argon2PasswordHasher,
    JwtTokenSigner,
    JwtStrategy,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'PasswordHasher',
      useClass: Argon2PasswordHasher,
    },
    {
      provide: 'TokenSigner',
      useClass: JwtTokenSigner,
    },
  ],
})
export class IdentityModule {}
