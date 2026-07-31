import { FakeResidentRepository } from '../../infrastructure/mock/FakeResidentRepository';
import { CreateResidentUseCase } from './CreateResidentUseCase';
import { CreateResidentCommand } from '../command/CreateResidentCommand';
import { ResidentAlreadyExistsException } from '../exceptions/ResidentAlreadyExistsException';
import { InvalidUuidException } from '../../domain/exceptions/value-objects/uuid/InvalidUuidException';
import { PersonNameIsRequiredException } from '../../domain/exceptions/value-objects/person-name/PersonNameIsRequiredException';
import { InvalidPersonNameException } from '../../domain/exceptions/value-objects/person-name/InvalidPersonNameException';

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
    ).rejects.toThrow(PersonNameIsRequiredException);
  });

  it('should throw on name with numbers', async () => {
    await expect(
      useCase.execute(
        new CreateResidentCommand(
          '550e8400-e29b-41d4-a716-446655440000',
          'Joã0 Silva',
        ),
      ),
    ).rejects.toThrow(InvalidPersonNameException);
  });

  it('should throw on invalid user id', async () => {
    await expect(
      useCase.execute(new CreateResidentCommand('not-a-uuid', 'João Silva')),
    ).rejects.toThrow(InvalidUuidException);
  });

  it('should throw when resident already exists', async () => {
    const command = new CreateResidentCommand(
      '550e8400-e29b-41d4-a716-446655440000',
      'João Silva',
    );

    await useCase.execute(command);

    await expect(useCase.execute(command)).rejects.toThrow(
      ResidentAlreadyExistsException,
    );
  });
});
