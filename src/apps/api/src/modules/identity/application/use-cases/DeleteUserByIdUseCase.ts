import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../ports/UserRepository';

@Injectable()
export class DeleteUserByIdUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.deleteById(id);
  }
}
