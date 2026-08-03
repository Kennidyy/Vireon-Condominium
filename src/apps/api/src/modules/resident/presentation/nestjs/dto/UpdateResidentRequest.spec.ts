import { validate } from 'class-validator';
import { UpdateResidentRequest } from './UpdateResidentRequest';

describe('UpdateResidentRequest', () => {
  it('should accept a valid name', async () => {
    const dto = new UpdateResidentRequest();
    dto.name = 'Novo Nome';

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should reject a missing name', async () => {
    const dto = new UpdateResidentRequest();

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });
});
