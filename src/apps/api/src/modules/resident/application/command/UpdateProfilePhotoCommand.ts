export class UpdateProfilePhotoCommand {
  constructor(
    public readonly id: string,
    public readonly storageKey: string,
    public readonly contentType: string,
    public readonly size: number,
  ) {}
}
