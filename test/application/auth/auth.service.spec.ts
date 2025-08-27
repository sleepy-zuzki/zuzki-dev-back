import { AuthService } from '@application/auth/services/auth.service';
import { AccessTokenPort } from '@application/auth/ports/access-token.port';
import { RefreshTokenPort } from '@application/auth/ports/refresh-token.port';

describe('AuthService (application)', () => {
  let access: jest.Mocked<AccessTokenPort>;
  let refresh: jest.Mocked<RefreshTokenPort>;
  let service: AuthService;

  beforeEach(() => {
    access = {
      signAccessToken: jest.fn(),
    };
    refresh = {
      generate: jest.fn(),
      rotate: jest.fn(),
      verify: jest.fn(),
      revoke: jest.fn(),
    };
    service = new AuthService(access, refresh);
  });

  it('signAccessToken delega en AccessTokenPort', async () => {
    access.signAccessToken.mockResolvedValue('JWT');
    const payload = { id: 'u1', email: 'a@b.c', roles: ['user'] };
    const token = await service.signAccessToken(payload);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(access.signAccessToken).toHaveBeenCalledWith(payload);
    expect(token).toBe('JWT');
  });

  it('generateRefreshToken delega en RefreshTokenPort', async () => {
    const exp = new Date(Date.now() + 60000);
    refresh.generate.mockResolvedValue({ refreshToken: 'rt', expiresAt: exp });
    const res = await service.generateRefreshToken('u1');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(refresh.generate).toHaveBeenCalledWith('u1');
    expect(res).toEqual({ refreshToken: 'rt', expiresAt: exp });
  });

  it('rotateRefreshToken delega en RefreshTokenPort', async () => {
    const exp = new Date(Date.now() + 60000);
    refresh.rotate.mockResolvedValue({ refreshToken: 'rt2', expiresAt: exp });
    const res = await service.rotateRefreshToken('u1', 'rt1');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(refresh.rotate).toHaveBeenCalledWith('u1', 'rt1');
    expect(res).toEqual({ refreshToken: 'rt2', expiresAt: exp });
  });

  it('verifyRefreshToken delega en RefreshTokenPort', async () => {
    refresh.verify.mockResolvedValue({ id: 'rt-id' });
    const ok = await service.verifyRefreshToken('u1', 'rt');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(refresh.verify).toHaveBeenCalledWith('u1', 'rt');
    expect(ok).toEqual({ id: 'rt-id' });
  });

  it('revokeRefreshToken delega en RefreshTokenPort', async () => {
    refresh.revoke.mockResolvedValue();
    await service.revokeRefreshToken('rt-id');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(refresh.revoke).toHaveBeenCalledWith('rt-id');
  });
});
