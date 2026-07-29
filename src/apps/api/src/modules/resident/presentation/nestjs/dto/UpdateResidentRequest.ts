import { IsString } from "class-validator";

export class UpdateResidentRequest {
    @IsString()
    name!: string
}