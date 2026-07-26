import { Inject, Injectable } from '@nestjs/common';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { UpdateUserDto } from '../dto/UpdateUserDto';
import type { PasswordHasher } from '../ports/PasswordHasher';
import type { UserRepository } from '../ports/UserRepository';
import { UserRole } from '../../domain/enum/UserRole';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('PasswordHasher')
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(id: string, dto: UpdateUserDto) {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new Error('User not Found');
    }

    if (dto.email) {
      user.changeEmail(Email.create(dto.email));
    }

    if (dto.password) {
      const password = Password.create(dto.password);
      const hash = await this.passwordHasher.hash(password.value);

      user.changePassword(Password.fromHash(hash));
    }

    if (dto.role) {
      user.changeRole(dto.role)
    }

    await this.userRepository.update(user);

    return user;
  }
}
