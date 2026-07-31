export class ResidentResponseDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly profilePhoto: string,
    public readonly contacts: ContactResponseDto[],
  ) {}
}
export class ContactResponseDto {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly value: string,
    public readonly isPrimary: boolean,
  ) {}
}
