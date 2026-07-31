import { IsNumber, IsString } from "class-validator";

export class UpdateProfilePhotoRequest {
    @IsString()
    storageKey!: string;

    @IsString()
    contentType!: string;

    @IsNumber()
    size!: number;
}
