import { Inject, Injectable } from "@nestjs/common";
import { TokenSigner } from "../../application/ports/TokenSigner";
import { TokenPayload } from "../../application/types/TokenPayload";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtTokenSigner implements TokenSigner {
    constructor(
        private readonly jwtService: JwtService
    ) {}

    async sign(payload: TokenPayload): Promise<string> {
        return this.jwtService.signAsync(payload)
    }
}