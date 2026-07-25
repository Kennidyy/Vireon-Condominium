import { User } from '../../domain/entities/User';

export interface UserRepository {
  save(user: User): Promise<void>;
  getByEmail(email: string): Promise<User | null>;
  getById(id: string): Promise<User | null>
}
