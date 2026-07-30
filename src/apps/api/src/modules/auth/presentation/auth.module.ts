import { Module } from '@nestjs/common';
import { IdentityModule } from '../../identity/presentation/nestjs/identity.module';
import { LoginUserUseCase } from '../application/use-cases/LoginUserUseCase';
import { JwtAuthGuard } from '../infrastructure/guards/JwtAuthGuard';
import { JwtTokenSigner } from '../infrastructure/tokens/JwtTokenSigner';
import { AuthController } from './controller/auth.controller';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RolesGuard } from '../infrastructure/guards/RolesGuard';
import { Argon2PasswordHasher } from '../../identity/infrastructure/crypto/Argon2PasswordHasher';
import { UserIdentityProvider } from '../../identity/infrastructure/providers/UserIdentityProvider';
import { JwtStrategy } from '../infrastructure/strategy/JwtStrategy';

@Module({
    imports: [
        IdentityModule,
         JwtModule.registerAsync({
              inject: [ConfigService],
              useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('auth.jwtSecret'),
                signOptions: {
                  expiresIn: configService.get<JwtSignOptions['expiresIn']>(
                    'auth.jwtExpiresIn',
                    '15m' as JwtSignOptions['expiresIn'],
                  ),
                },
              }),
            }),
    ],

    providers: [
        LoginUserUseCase,
        JwtTokenSigner,
        JwtAuthGuard,
        JwtStrategy,
        RolesGuard,

        {
          provide: 'IdentityProvider',
          useExisting: UserIdentityProvider
        },
        {
          provide: 'AuthPasswordHasher',
          useClass: Argon2PasswordHasher
        },
        {
          provide: 'TokenSigner',
          useClass: JwtTokenSigner
        }
    ],

    controllers: [
        AuthController,
    ],

    exports: [
        JwtAuthGuard,
        RolesGuard,
    ]
})
export class AuthModule {}
