import { ContactResponseDto, ResidentResponseDto } from './ResidentResponseDto';

describe('ResidentResponseDto', () => {
  it('should expose id, name, profilePhoto and contacts', () => {
    const contact = new ContactResponseDto(
      'contact-id',
      'EMAIL',
      'joao@example.com',
      true,
    );

    const dto = new ResidentResponseDto(
      'resident-id',
      'João Silva',
      'photos/abc.png',
      [contact],
    );

    expect(dto.id).toBe('resident-id');
    expect(dto.name).toBe('João Silva');
    expect(dto.profilePhoto).toBe('photos/abc.png');
    expect(dto.contacts).toEqual([
      {
        id: 'contact-id',
        type: 'EMAIL',
        value: 'joao@example.com',
        isPrimary: true,
      },
    ]);
  });
});
