import { IsString } from "class-validator";

export class UpdateResidentRequest {
    @IsString()
    id!: string

    @IsString()
    name!: string
}