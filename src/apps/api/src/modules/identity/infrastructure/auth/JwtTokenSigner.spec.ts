import { JwtTokenSigner } from './JwtTokenSigner';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../domain/enum/UserRole';

describe('JwtTokenSigner', () => {
  let signer: JwtTokenSigner;

  let signAsyncMock: jest.Mock;

  beforeEach(() => {
    signAsyncMock = jest.fn().mockResolvedValue('signed-jwt-token');

    const mockJwtService = {
      signAsync: signAsyncMock,
    } as unknown as JwtService;
    signer = new JwtTokenSigner(mockJwtService);
  });

  it('should sign a token with given payload', async () => {
    const token = await signer.sign({
      sub: 'user-id-123',
      role: UserRole.ADMIN,
    });

    expect(token).toBe('signed-jwt-token');
    expect(signAsyncMock).toHaveBeenCalledWith({
      sub: 'user-id-123',
      role: 'ADMIN',
    });
  });

  it('should sign a token with USER role', async () => {
    await signer.sign({
      sub: 'user-id-456',
      role: UserRole.USER,
    });

    expect(signAsyncMock).toHaveBeenCalledWith({
      sub: 'user-id-456',
      role: 'USER',
    });
  });
});
