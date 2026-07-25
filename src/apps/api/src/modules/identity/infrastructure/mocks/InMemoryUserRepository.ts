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

  
  getById(id: string): Promise<User | null> { // TODO: implement getById as soon as possible
    return Promise.resolve(null)
  }

  deleteById(id: string): Promise<void> { // TODO: implement getById as soon as possible
    return Promise.resolve()
  }

  update(user: User): Promise<void> { // TODO: implement getById as soon as possible
    return Promise.resolve()
  }
}
