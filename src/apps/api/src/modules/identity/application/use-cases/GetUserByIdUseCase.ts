import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../ports/UserRepository';
import { UserNotFoundException } from '../exceptions/UserNotFoundException';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return {
      id: user.id,
      email: user.email.value,
    };
  }
}
