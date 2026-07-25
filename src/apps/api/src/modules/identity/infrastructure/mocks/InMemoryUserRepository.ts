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

  getById(id: string): Promise<User | null> {
    const user = [...this.users.values()].find((user) => user.id === id);
    return Promise.resolve(user ?? null);
  }

  deleteById(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
    return Promise.resolve();
  }

  update(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
    return Promise.resolve();
  }
}
