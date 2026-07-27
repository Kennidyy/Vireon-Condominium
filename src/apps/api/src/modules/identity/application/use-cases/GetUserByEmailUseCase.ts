import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../ports/UserRepository';
import { UserNotFoundException } from '../exceptions/UserNotFoundException';

@Injectable()
export class GetUserByEmailUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string) {
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw new UserNotFoundException();
    }

    return {
      id: user.id,
      email: user.email.value,
    };
  }
}
