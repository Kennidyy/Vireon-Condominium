import { UserRepository } from '../../application/ports/UserRepository';
import { User } from '../../domain/entities/User';

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = [];

  save(user: User): Promise<void> {
    this.users.push(user);

    return Promise.resolve();
  }

  getByEmail(email: string): Promise<User | null> {
    const user = [...this.users.values()].find(
      (user) => user.email.value === email,
    );

    return Promise.resolve(user ?? null);
  }
}
