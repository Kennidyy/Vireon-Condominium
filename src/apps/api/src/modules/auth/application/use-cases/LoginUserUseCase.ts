import { Inject, Injectable } from '@nestjs/common';
import type { IdentityProvider } from '../ports/IdentityProvider';
import { LoginUserCommand } from '../command/LoginUserCommand';
import type { AuthPasswordHasher } from '../ports/AuthPasswordHasher';
import type { TokenSigner } from '../ports/TokenSigner';
import { InvalidCredentialException } from '../../../identity/application/exceptions/InvalidCredentialException';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('IdentityProvider')
    private readonly identityProvider: IdentityProvider,
    @Inject('AuthPasswordHasher')
    private readonly authPasswordHasher: AuthPasswordHasher,
    @Inject('TokenSigner')
    private readonly tokenSigner: TokenSigner,
  ) {}

  async execute(command: LoginUserCommand) {
    const user = await this.identityProvider.getByEmail(command.email);

    if (!user) {
      throw new InvalidCredentialException();
    }

    const validPassword = await this.authPasswordHasher.compare(
      command.password,
      user.passwordHash,
    );

    if (!validPassword) {
      throw new InvalidCredentialException();
    }

    const token = await this.tokenSigner.sign({
      sub: user.id,
      role: user.role,
    });

    return {
      accessToken: token,
    };
  }
}
