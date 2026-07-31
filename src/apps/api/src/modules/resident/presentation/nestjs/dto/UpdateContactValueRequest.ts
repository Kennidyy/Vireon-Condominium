import { IsString } from "class-validator";

export class UpdateContactValueRequest {
    @IsString()
    value!: string;
}
