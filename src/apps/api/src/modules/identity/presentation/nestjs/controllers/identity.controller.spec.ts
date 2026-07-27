import { IdentityController } from './identity.controller';
import type { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import type { GetUserByEmailUseCase } from '../../../application/use-cases/GetUserByEmailUseCase';
import type { GetUserByIdUseCase } from '../../../application/use-cases/GetUserByIdUseCase';
import type { DeleteUserByIdUseCase } from '../../../application/use-cases/DeleteUserByIdUseCase';
import type { UpdateUserUseCase } from '../../../application/use-cases/UpdateUserUseCase';
import type { GetAllUsersUseCase } from '../../../application/use-cases/GetAllUsersUseCase';
import type { LoginUseCase } from '../../../application/use-cases/LoginUseCase';
import { User } from '../../../domain/entities/User';
import { Email } from '../../../domain/value-objects/Email';
import { Password } from '../../../domain/value-objects/Password';

type MockUseCase = { execute: jest.Mock };

describe('IdentityController', () => {
  let controller: IdentityController;
  let mockCreateUser: MockUseCase;
  let mockGetByEmail: MockUseCase;
  let mockGetById: MockUseCase;
  let mockDelete: MockUseCase;
  let mockUpdate: MockUseCase;
  let mockGetAll: MockUseCase;
  let mockLogin: MockUseCase;

  const createTestUser = () => {
    const email = Email.create('test@email.com');
    const password = Password.create('StrongPass123!');
    return User.create(email, password);
  };

  beforeEach(() => {
    mockCreateUser = { execute: jest.fn() };
    mockGetByEmail = { execute: jest.fn() };
    mockGetById = { execute: jest.fn() };
    mockDelete = { execute: jest.fn() };
    mockUpdate = { execute: jest.fn() };
    mockGetAll = { execute: jest.fn() };
    mockLogin = { execute: jest.fn() };

    controller = new IdentityController(
      mockCreateUser as unknown as CreateUserUseCase,
      mockGetByEmail as unknown as GetUserByEmailUseCase,
      mockGetById as unknown as GetUserByIdUseCase,
      mockDelete as unknown as DeleteUserByIdUseCase,
      mockUpdate as unknown as UpdateUserUseCase,
      mockGetAll as unknown as GetAllUsersUseCase,
      mockLogin as unknown as LoginUseCase,
    );
  });

  describe('login', () => {
    it('should call login use case', async () => {
      const dto = { email: 'user@email.com', password: 'StrongPass123!' };
      mockLogin.execute.mockResolvedValue({ accessToken: 'token' });

      const result = await controller.login(dto);

      expect(mockLogin.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ accessToken: 'token' });
    });
  });

  describe('create', () => {
    it('should call create user use case', async () => {
      const dto = { email: 'new@email.com', password: 'StrongPass123!' };

      await controller.create(dto);

      expect(mockCreateUser.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('getByEmail', () => {
    it('should call get by email use case', async () => {
      mockGetByEmail.execute.mockResolvedValue({
        id: 'id',
        email: 'test@email.com',
      });

      const result = await controller.getByEmail('test@email.com');

      expect(mockGetByEmail.execute).toHaveBeenCalledWith('test@email.com');
      expect(result).toEqual({ id: 'id', email: 'test@email.com' });
    });
  });

  describe('getById', () => {
    it('should call get by id use case', async () => {
      mockGetById.execute.mockResolvedValue({
        id: 'user-id',
        email: 'test@email.com',
      });

      const result = await controller.getById('user-id');

      expect(mockGetById.execute).toHaveBeenCalledWith('user-id');
      expect(result).toEqual({ id: 'user-id', email: 'test@email.com' });
    });
  });

  describe('getAll', () => {
    it('should return users mapped to DTOs', async () => {
      const user = createTestUser();
      mockGetAll.execute.mockResolvedValue([user]);

      const result = await controller.getAll();

      expect(mockGetAll.execute).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(user.id);
      expect(result[0].email).toBe(user.email.value);
    });
  });

  describe('update', () => {
    it('should call update use case', async () => {
      const dto = { email: 'updated@email.com' };

      await controller.update('user-id', dto);

      expect(mockUpdate.execute).toHaveBeenCalledWith('user-id', dto);
    });
  });

  describe('deleteById', () => {
    it('should call delete use case', async () => {
      await controller.deleteById('user-id');

      expect(mockDelete.execute).toHaveBeenCalledWith('user-id');
    });
  });

  describe('me', () => {
    it('should return request user', () => {
      const req = { user: { id: 'my-id', role: 'ADMIN' as const } };

      const result = controller.me(req);

      expect(result).toEqual({ id: 'my-id', role: 'ADMIN' });
    });
  });
});
