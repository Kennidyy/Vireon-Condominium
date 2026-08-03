import { validate } from 'class-validator';
import { CreateResidentRequest } from './CreateResidentRequest';

describe('CreateResidentRequest', () => {
  it('should accept a valid name', async () => {
    const dto = new CreateResidentRequest();
    dto.name = 'João Silva';

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should reject an empty name', async () => {
    const dto = new CreateResidentRequest();
    dto.name = '';

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });

  it('should reject a missing name', async () => {
    const dto = new CreateResidentRequest();

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });
});
