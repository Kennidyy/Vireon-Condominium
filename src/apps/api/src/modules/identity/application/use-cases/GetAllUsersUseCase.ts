import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../ports/UserRepository';
import { User } from '../../domain/entities/User';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.getAll();
  }
}
