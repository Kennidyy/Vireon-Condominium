import { FakeResidentRepository } from '../../infrastructure/repositories/mock/FakeResidenteRepository';
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
      new CreateResidentCommand('141', 'photos/abc.png', 'João Silva'),
    );

    const resident = await repository.findByName('João Silva');
    expect(resident).not.toBeNull();
    expect(resident!.name).toBe('João Silva');
    expect(resident!.profilePhoto).toBe('photos/abc.png');
  });

  it('should throw on empty name', async () => {
    await expect(
      useCase.execute(new CreateResidentCommand('141', 'photos/abc.png', '')),
    ).rejects.toThrow('Name is required');
  });

  it('should throw on name with numbers', async () => {
    await expect(
      useCase.execute(
        new CreateResidentCommand('141', 'photos/abc.png', 'Joã0 Silva'),
      ),
    ).rejects.toThrow('Name cannot contain numbers');
  });

  it('should throw on empty profile photo storage key', async () => {
    await expect(
      useCase.execute(new CreateResidentCommand('141', '', 'João Silva')),
    ).rejects.toThrow('Storage key is mandatory');
  });
});
