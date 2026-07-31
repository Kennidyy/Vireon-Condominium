import { Inject, Injectable } from '@nestjs/common';
import type { IdentityProvider } from '../ports/IdentityProvider';
import { LoginUserCommand } from '../command/LoginUserCommand';
import type { AuthPasswordHasher } from '../ports/AuthPasswordHasher';
import type { TokenSigner } from '../ports/TokenSigner';

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
      throw new Error('Wrong credentials');
    }

    const validPassword = await this.authPasswordHasher.compare(
      command.password,
      user.passwordHash,
    );

    if (!validPassword) {
      throw new Error('Wrong credentials');
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
