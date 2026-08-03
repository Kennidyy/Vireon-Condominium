import { ResidentController } from './resident.controller';
import type { CreateResidentUseCase } from '../../../application/use-cases/CreateResidentUseCase';
import type { GetByNameUseCase } from '../../../application/use-cases/GetByNameUseCase';
import type { GetAllResidentsUseCase } from '../../../application/use-cases/GetAllResidentsUseCase';
import type { UpdateResidentUseCase } from '../../../application/use-cases/UpdateResidentNameUseCase';
import type { DeleteResidentUseCase } from '../../../application/use-cases/DeleteResidentUseCase';
import type { GetResidentByIdUseCase } from '../../../application/use-cases/GetResidentByIdUseCase';
import type { UpdateProfilePhotoUseCase } from '../../../application/use-cases/UpdateProfilePhotoUseCase';
import type { AddContactUseCase } from '../../../application/use-cases/AddContactUseCase';
import type { UpdateContactValueUseCase } from '../../../application/use-cases/UpdateContactValueUseCase';
import type { SetPrimaryContactUseCase } from '../../../application/use-cases/SetPrimaryContactUseCase';
import type { RemoveContactUseCase } from '../../../application/use-cases/RemoveContactUseCase';
import { Resident } from '../../../domain/entities/Resident';
import { Uuid } from '../../../domain/value-objects/Uuid';
import { PersonName } from '../../../domain/value-objects/PersonName';
import { ProfilePhoto } from '../../../domain/entities/ProfilePhoto';
import { ImageType } from '../../../domain/enum/ImageType';
import type { AuthenticatedRequest } from '../dto/AuthenticatedRequest';

type MockUseCase = { execute: jest.Mock };

describe('ResidentController', () => {
  let controller: ResidentController;
  let mockCreate: MockUseCase;
  let mockGetByName: MockUseCase;
  let mockGetAll: MockUseCase;
  let mockUpdate: MockUseCase;
  let mockDelete: MockUseCase;
  let mockGetById: MockUseCase;
  let mockUpdatePhoto: MockUseCase;
  let mockAddContact: MockUseCase;
  let mockUpdateContactValue: MockUseCase;
  let mockSetPrimaryContact: MockUseCase;
  let mockRemoveContact: MockUseCase;

  const createTestResident = () =>
    Resident.create(
      Uuid.generate(),
      PersonName.create('João Silva'),
      ProfilePhoto.create('photos/abc.png', ImageType.PNG, 1024),
    );

  beforeEach(() => {
    mockCreate = { execute: jest.fn() };
    mockGetByName = { execute: jest.fn() };
    mockGetAll = { execute: jest.fn() };
    mockUpdate = { execute: jest.fn() };
    mockDelete = { execute: jest.fn() };
    mockGetById = { execute: jest.fn() };
    mockUpdatePhoto = { execute: jest.fn() };
    mockAddContact = { execute: jest.fn() };
    mockUpdateContactValue = { execute: jest.fn() };
    mockSetPrimaryContact = { execute: jest.fn() };
    mockRemoveContact = { execute: jest.fn() };

    controller = new ResidentController(
      mockCreate as unknown as CreateResidentUseCase,
      mockGetByName as unknown as GetByNameUseCase,
      mockGetAll as unknown as GetAllResidentsUseCase,
      mockUpdate as unknown as UpdateResidentUseCase,
      mockDelete as unknown as DeleteResidentUseCase,
      mockGetById as unknown as GetResidentByIdUseCase,
      mockUpdatePhoto as unknown as UpdateProfilePhotoUseCase,
      mockAddContact as unknown as AddContactUseCase,
      mockUpdateContactValue as unknown as UpdateContactValueUseCase,
      mockSetPrimaryContact as unknown as SetPrimaryContactUseCase,
      mockRemoveContact as unknown as RemoveContactUseCase,
    );
  });

  describe('create', () => {
    it('should call create use case with the authenticated user id', async () => {
      const req = {
        user: { id: 'user-id', role: 'USER' as const },
      } as AuthenticatedRequest;
      const dto = { name: 'João Silva' };

      await controller.create(req, dto);

      expect(mockCreate.execute).toHaveBeenCalledWith({
        id: 'user-id',
        name: 'João Silva',
      });
    });
  });

  describe('update', () => {
    it('should call update use case with the authenticated user id', async () => {
      const req = {
        user: { id: 'user-id', role: 'USER' as const },
      } as AuthenticatedRequest;
      const request = { name: 'Novo Nome' };

      await controller.update(req, request);

      expect(mockUpdate.execute).toHaveBeenCalledWith({
        id: 'user-id',
        name: 'Novo Nome',
      });
    });
  });

  describe('delete', () => {
    it('should call delete use case with the id', async () => {
      await controller.delete('resident-id');

      expect(mockDelete.execute).toHaveBeenCalledWith({ id: 'resident-id' });
    });
  });

  describe('getByName', () => {
    it('should return residents mapped to DTOs', async () => {
      const resident = createTestResident();
      mockGetByName.execute.mockResolvedValue([resident]);

      const result = await controller.getByName('João');

      expect(mockGetByName.execute).toHaveBeenCalledWith('João');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(resident.id);
      expect(result[0].name).toBe('João Silva');
      expect(result[0].profilePhoto).toBe('photos/abc.png');
    });
  });

  describe('getAll', () => {
    it('should return all residents mapped to DTOs', async () => {
      const resident = createTestResident();
      mockGetAll.execute.mockResolvedValue([resident]);

      const result = await controller.getAll();

      expect(mockGetAll.execute).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('João Silva');
    });
  });

  describe('getById', () => {
    it('should return the resident mapped to DTO', async () => {
      const resident = createTestResident();
      mockGetById.execute.mockResolvedValue(resident);

      const result = await controller.getById('resident-id');

      expect(mockGetById.execute).toHaveBeenCalledWith('resident-id');
      expect(result?.id).toBe(resident.id);
      expect(result?.name).toBe('João Silva');
    });
  });

  describe('updatePhoto', () => {
    it('should call update photo use case with the command', async () => {
      const resident = createTestResident();
      mockUpdatePhoto.execute.mockResolvedValue(resident);
      const dto = {
        storageKey: 'photos/new.png',
        contentType: 'image/jpeg',
        size: 512,
      };

      const result = await controller.updatePhoto('resident-id', dto);

      expect(mockUpdatePhoto.execute).toHaveBeenCalledWith({
        id: 'resident-id',
        storageKey: 'photos/new.png',
        contentType: 'image/jpeg',
        size: 512,
      });
      expect(result?.profilePhoto).toBe('photos/abc.png');
    });
  });

  describe('addContact', () => {
    it('should call add contact use case with the command', async () => {
      const resident = createTestResident();
      mockAddContact.execute.mockResolvedValue(resident);
      const dto = { type: 'EMAIL', value: 'joao@example.com' };

      const result = await controller.addContact('resident-id', dto);

      expect(mockAddContact.execute).toHaveBeenCalledWith({
        id: 'resident-id',
        type: 'EMAIL',
        value: 'joao@example.com',
      });
      expect(result?.id).toBe(resident.id);
    });
  });

  describe('updateContactValue', () => {
    it('should call update contact value use case with the command', async () => {
      const resident = createTestResident();
      mockUpdateContactValue.execute.mockResolvedValue(resident);
      const dto = { value: 'new@example.com' };

      const result = await controller.updateContactValue(
        'resident-id',
        'contact-id',
        dto,
      );

      expect(mockUpdateContactValue.execute).toHaveBeenCalledWith({
        id: 'resident-id',
        contactId: 'contact-id',
        value: 'new@example.com',
      });
      expect(result?.id).toBe(resident.id);
    });
  });

  describe('setPrimaryContact', () => {
    it('should call set primary contact use case with the command', async () => {
      const resident = createTestResident();
      mockSetPrimaryContact.execute.mockResolvedValue(resident);

      const result = await controller.setPrimaryContact(
        'resident-id',
        'contact-id',
      );

      expect(mockSetPrimaryContact.execute).toHaveBeenCalledWith({
        id: 'resident-id',
        contactId: 'contact-id',
      });
      expect(result?.id).toBe(resident.id);
    });
  });

  describe('removeContact', () => {
    it('should call remove contact use case with the command', async () => {
      const resident = createTestResident();
      mockRemoveContact.execute.mockResolvedValue(resident);

      const result = await controller.removeContact(
        'resident-id',
        'contact-id',
      );

      expect(mockRemoveContact.execute).toHaveBeenCalledWith({
        id: 'resident-id',
        contactId: 'contact-id',
      });
      expect(result?.id).toBe(resident.id);
    });
  });
});
