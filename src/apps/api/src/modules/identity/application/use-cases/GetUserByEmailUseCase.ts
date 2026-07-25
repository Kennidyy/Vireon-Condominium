import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../ports/UserRepository';

@Injectable()
export class GetUserByEmailUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string) {
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email.value,
    };
  }
}
