import { User } from '../../domain/entities/User';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { CreateUserDto } from '../dto/CreateUserDto';
import { PasswordHasher } from '../ports/PasswordHasher';
import { UserRepository } from '../ports/UserRepository';

export class CreateUserUseCase {
  constructor(
    private readonly passwordHasher: PasswordHasher,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const email = Email.create(dto.email);

    const exists = await this.userRepository.getByEmail(email.value);

    if (exists) {
      throw new Error('This email is already in use');
    }

    const password = Password.create(dto.password);

    const passwordHash = await this.passwordHasher.hash(password.value);

    const user = User.create(
      crypto.randomUUID(),
      email,
      Password.fromHash(passwordHash),
    );

    await this.userRepository.save(user);

    return user;
  }
}
