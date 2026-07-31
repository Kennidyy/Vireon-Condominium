import { validate } from 'class-validator';
import { AddContactRequest } from './AddContactRequest';

describe('AddContactRequest', () => {
  it('should accept valid contact data', async () => {
    const dto = new AddContactRequest();
    dto.type = 'EMAIL';
    dto.value = 'joao@example.com';

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should reject a missing type', async () => {
    const dto = new AddContactRequest();
    dto.value = 'joao@example.com';

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('type');
  });

  it('should reject a missing value', async () => {
    const dto = new AddContactRequest();
    dto.type = 'EMAIL';

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('value');
  });
});
