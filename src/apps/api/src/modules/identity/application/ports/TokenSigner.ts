import { TokenPayload } from "../types/TokenPayload";

export interface TokenSigner {
    sign(payload: TokenPayload): Promise<string>
}