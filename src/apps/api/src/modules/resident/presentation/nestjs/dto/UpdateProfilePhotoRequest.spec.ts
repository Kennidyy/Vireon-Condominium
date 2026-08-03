import { validate } from 'class-validator';
import { UpdateProfilePhotoRequest } from './UpdateProfilePhotoRequest';

describe('UpdateProfilePhotoRequest', () => {
  it('should accept valid photo data', async () => {
    const dto = new UpdateProfilePhotoRequest();
    dto.storageKey = 'photos/abc.png';
    dto.contentType = 'image/png';
    dto.size = 1024;

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should reject a non-string storage key', async () => {
    const dto = new UpdateProfilePhotoRequest();
    dto.storageKey = 123 as unknown as string;
    dto.contentType = 'image/png';
    dto.size = 1024;

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('storageKey');
  });

  it('should reject a non-number size', async () => {
    const dto = new UpdateProfilePhotoRequest();
    dto.storageKey = 'photos/abc.png';
    dto.contentType = 'image/png';
    dto.size = 'large' as unknown as number;

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('size');
  });
});
