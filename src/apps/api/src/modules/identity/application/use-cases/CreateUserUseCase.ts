import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { CreateUserDto } from '../dto/CreateUserDto';
import type { PasswordHasher } from '../ports/PasswordHasher';
import type { UserRepository } from '../ports/UserRepository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('PasswordHasher')
    private readonly passwordHasher: PasswordHasher,

    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: CreateUserDto) {
    const email = Email.create(dto.email);

    const exists = await this.userRepository.getByEmail(email.value);

    if (exists) {
      throw new Error('This email is already in use');
    }

    const password = Password.create(dto.password);

    const passwordHash = await this.passwordHasher.hash(password.value);

    const user = User.create(email, Password.fromHash(passwordHash));

    await this.userRepository.save(user);
    
  }
}
