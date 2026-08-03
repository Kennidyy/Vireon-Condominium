import { FakeResidentRepository } from './FakeResidentRepository';
import { Resident } from '../../domain/entities/Resident';
import { Uuid } from '../../domain/value-objects/Uuid';
import { PersonName } from '../../domain/value-objects/PersonName';
import { ProfilePhoto } from '../../domain/entities/ProfilePhoto';
import { ImageType } from '../../domain/enum/ImageType';

describe('FakeResidentRepository', () => {
  let repository: FakeResidentRepository;

  const makeResident = () =>
    Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );

  beforeEach(() => {
    repository = new FakeResidentRepository();
  });

  describe('save', () => {
    it('should save a resident', async () => {
      const resident = makeResident();

      await repository.save(resident);

      const found = await repository.getById(resident.id);
      expect(found?.id).toBe(resident.id);
    });
  });

  describe('update', () => {
    it('should update an existing resident', async () => {
      const resident = makeResident();
      await repository.save(resident);

      resident.changeName('Novo Nome');
      await repository.update(resident);

      const updated = await repository.getById(resident.id);
      expect(updated?.name).toBe('Novo Nome');
    });

    it('should not throw when updating a non-existent resident', async () => {
      const resident = makeResident();

      await expect(repository.update(resident)).resolves.toBeUndefined();
    });
  });

  describe('getByName', () => {
    it('should find residents by name', async () => {
      const resident = makeResident();
      await repository.save(resident);

      const found = await repository.getByName('João');

      expect(found).toHaveLength(1);
      expect(found[0].id).toBe(resident.id);
    });

    it('should be case insensitive', async () => {
      const resident = makeResident();
      await repository.save(resident);

      const found = await repository.getByName('joão');

      expect(found).toHaveLength(1);
    });

    it('should return empty array when no resident matches', async () => {
      const found = await repository.getByName('Inexistente');

      expect(found).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should find a resident by id', async () => {
      const resident = makeResident();
      await repository.save(resident);

      const found = await repository.getById(resident.id);

      expect(found?.name).toBe('João Silva');
    });

    it('should return null when id not found', async () => {
      const found = await repository.getById('non-existent-id');

      expect(found).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return all residents', async () => {
      await repository.save(makeResident());
      await repository.save(
        Resident.create(
          Uuid.generate(),
          PersonName.create('Maria Souza'),
          ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
        ),
      );

      const all = await repository.getAll();

      expect(all).toHaveLength(2);
    });

    it('should return empty array when no residents', async () => {
      const all = await repository.getAll();

      expect(all).toEqual([]);
    });
  });

  describe('delete', () => {
    it('should delete an existing resident', async () => {
      const resident = makeResident();
      await repository.save(resident);

      await repository.delete(resident.id);

      const found = await repository.getById(resident.id);
      expect(found).toBeNull();
    });

    it('should not throw when deleting a non-existent resident', async () => {
      await expect(
        repository.delete('non-existent-id'),
      ).resolves.toBeUndefined();
    });
  });
});
