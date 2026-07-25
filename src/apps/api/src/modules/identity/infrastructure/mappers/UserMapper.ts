import { UserRole as PrismaUserRole } from '@prisma/client';
import { UserRole } from '../../domain/enum/UserRole';
import { User } from '../../domain/entities/User';

export class UserMapper {
  static toDomain(data: {
    id: string;
    email: string;
    password: string;
    role: PrismaUserRole;
  }): User {
    return User.restore(
      data.id,
      data.email,
      data.password,
      this.toDomainRole(data.role),
    );
  }

  static toPersistence(user: User) {
    return {
      id: user.id,
      email: user.email.value,
      password: user.password.value,
      role: this.toPersistenceRole(user.role),
    };
  }

  private static toDomainRole(role: PrismaUserRole): UserRole {
    switch (role) {
      case PrismaUserRole.USER:
        return UserRole.USER;

      case PrismaUserRole.ADMIN:
        return UserRole.ADMIN;
    }
  }

  private static toPersistenceRole(role: UserRole): PrismaUserRole {
    switch (role) {
      case UserRole.USER:
        return PrismaUserRole.USER;

      case UserRole.ADMIN:
        return PrismaUserRole.ADMIN;
    }
  }
}