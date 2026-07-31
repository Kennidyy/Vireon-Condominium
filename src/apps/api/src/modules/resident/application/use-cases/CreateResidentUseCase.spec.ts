import { FakeResidentRepository } from '../../infrastructure/mock/FakeResidentRepository';
import { CreateResidentUseCase } from './CreateResidentUseCase';
import { CreateResidentCommand } from '../command/CreateResidentCommand';

describe('CreateResidentUseCase', () => {
  let repository: FakeResidentRepository;
  let useCase: CreateResidentUseCase;

  beforeEach(() => {
    repository = new FakeResidentRepository();
    useCase = new CreateResidentUseCase(repository);
  });

  it('should create a resident', async () => {
    await useCase.execute(
      new CreateResidentCommand(
        '550e8400-e29b-41d4-a716-446655440000',
        'João Silva',
      ),
    );

    const residents = await repository.getByName('João Silva');
    const resident = residents[0];
    expect(resident).not.toBeNull();
    expect(resident.name).toBe('João Silva');
    expect(resident.userId).toBe('550e8400-e29b-41d4-a716-446655440000');
  });

  it('should throw on empty name', async () => {
    await expect(
      useCase.execute(
        new CreateResidentCommand('550e8400-e29b-41d4-a716-446655440000', ''),
      ),
    ).rejects.toThrow('Name is required');
  });

  it('should throw on name with numbers', async () => {
    await expect(
      useCase.execute(
        new CreateResidentCommand(
          '550e8400-e29b-41d4-a716-446655440000',
          'Joã0 Silva',
        ),
      ),
    ).rejects.toThrow('Name cannot contain numbers');
  });

  it('should throw on invalid user id', async () => {
    await expect(
      useCase.execute(new CreateResidentCommand('not-a-uuid', 'João Silva')),
    ).rejects.toThrow('Invalid Uuid');
  });
});
