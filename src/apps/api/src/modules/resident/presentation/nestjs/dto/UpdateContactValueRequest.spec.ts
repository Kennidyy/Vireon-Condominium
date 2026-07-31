import { validate } from 'class-validator';
import { UpdateContactValueRequest } from './UpdateContactValueRequest';

describe('UpdateContactValueRequest', () => {
  it('should accept a valid value', async () => {
    const dto = new UpdateContactValueRequest();
    dto.value = 'joao@example.com';

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should reject a missing value', async () => {
    const dto = new UpdateContactValueRequest();

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('value');
  });
});
