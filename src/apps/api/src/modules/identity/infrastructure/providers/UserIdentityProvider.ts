import { Inject, Injectable } from '@nestjs/common';
import { IdentityProvider } from '../../../auth/application/ports/IdentityProvider';
import type { UserRepository } from '../../application/ports/UserRepository';

@Injectable()
export class UserIdentityProvider implements IdentityProvider {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async getByEmail(email: string) {
    const user = await this.userRepository.getByEmail(email);

    if (!user) return null;

    return {
      id: user.id,
      passwordHash: user.password.value,
      role: user.role,
    };
  }
}
