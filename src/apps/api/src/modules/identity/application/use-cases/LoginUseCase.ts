import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../ports/UserRepository';
import type { PasswordHasher } from '../ports/PasswordHasher';
import { LoginDto } from '../dto/LoginDto';
import { Email } from '../../domain/value-objects/Email';
import type { TokenSigner } from '../ports/TokenSigner';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('PasswordHasher')
    private readonly passwordHasher: PasswordHasher,

    @Inject('TokenSigner')
    private readonly tokenSigner: TokenSigner,
  ) {}

  async execute(dto: LoginDto) {
    const email = Email.create(dto.email);

    const user = await this.userRepository.getByEmail(email.value);

    if (!user) {
      throw new Error('email or password are wrong');
    }

    const passwordMatches = await this.passwordHasher.compare(
      dto.password,
      user.password.value,
    );

    if (!passwordMatches) {
      throw new Error('email or password are wrong');
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
