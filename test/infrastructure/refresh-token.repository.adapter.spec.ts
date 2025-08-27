import { RefreshTokenTypeormAdapter } from '@infra/database/typeorm/adapters/refresh-token.repository.adapter';
import { HashingPort } from '@application/security/ports/hashing.port';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from '@infra/database/typeorm/entities/auth/refresh-token.entity';
import { ConfigurationService } from '@config/configuration.service';

type RefreshRow = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
};

type RepoMock = {
  create: jest.Mock<RefreshRow, [Record<string, unknown>]>;
  save: jest.Mock<Promise<RefreshRow>, [Record<string, unknown>]>;
  find: jest.Mock<Promise<RefreshRow[]>, [any?]>;
  update: jest.Mock<Promise<void>, [any, any]>;
};

type ConfigMock = {
  getNumber: jest.Mock<number, [string, number?]>;
};

describe('RefreshTokenTypeormAdapter (infrastructure)', () => {
  const now = new Date();
  let repoMock: RepoMock;
  let repo: Repository<RefreshTokenEntity>;
  let hashing: jest.Mocked<HashingPort>;
  let config: ConfigurationService;
  let adapter: RefreshTokenTypeormAdapter;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(now);

    repoMock = {
      create: jest.fn((e: Record<string, unknown>) => e as RefreshRow),
      save: jest.fn((e: Record<string, unknown>) =>
        Promise.resolve(e as RefreshRow),
      ),
      find: jest.fn(() => Promise.resolve([] as RefreshRow[])),
      update: jest.fn(() => Promise.resolve(undefined)),
    };

    hashing = {
      hash: jest.fn(() => 'HASHED'),
      verify: jest.fn(() => true),
    };

    const configMock: ConfigMock = {
      getNumber: jest.fn((key: string, def?: number) => {
        if (key === 'REFRESH_TOKEN_TTL') return 60; // 60s TTL
        return def ?? 0;
      }),
    };
    config = configMock as unknown as ConfigurationService;

    // Cast controlado: inyectamos el mock como Repository<RefreshTokenEntity> para el adapter
    repo = repoMock as unknown as Repository<RefreshTokenEntity>;

    adapter = new RefreshTokenTypeormAdapter(repo, hashing, config);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('generate crea y guarda un token con expiración basada en TTL', async () => {
    const { refreshToken, expiresAt } = await adapter.generate('user-1');

    expect(typeof refreshToken).toBe('string');
    expect(refreshToken.length).toBeGreaterThan(0);

    const delta = expiresAt.getTime() - now.getTime();
    expect(delta).toBeGreaterThan(0);
    expect(delta).toBeLessThanOrEqual(60_000);

    expect(repoMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        tokenHash: 'HASHED',
        revokedAt: null,
      }),
    );
    expect(repoMock.save).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(hashing.hash).toHaveBeenCalled();
  });

  it('verify retorna id cuando el hash coincide y no está expirado', async () => {
    const future = new Date(now.getTime() + 10_000);
    repoMock.find.mockResolvedValue([
      {
        id: 'rt1',
        userId: 'user-1',
        tokenHash: 'HASHED',
        expiresAt: future,
        revokedAt: null,
      },
    ]);
    hashing.verify.mockResolvedValueOnce(true);

    const result = await adapter.verify('user-1', 'plain');

    expect(repoMock.find).toHaveBeenCalledWith({
      where: { userId: 'user-1', revokedAt: null },
    });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(hashing.verify).toHaveBeenCalledWith('HASHED', 'plain');
    expect(result).toEqual({ id: 'rt1' });
  });

  it('verify ignora tokens expirados y devuelve null', async () => {
    const past = new Date(now.getTime() - 1_000);
    repoMock.find.mockResolvedValue([
      {
        id: 'rt1',
        userId: 'user-1',
        tokenHash: 'HASHED',
        expiresAt: past,
        revokedAt: null,
      },
    ]);

    const result = await adapter.verify('user-1', 'plain');

    expect(result).toBeNull();
  });

  it('rotate revoca el token actual y genera uno nuevo', async () => {
    const spyVerify = jest
      .spyOn(adapter, 'verify')
      .mockResolvedValue({ id: 'rt1' });
    const newExp = new Date(now.getTime() + 60_000);
    const spyGenerate = jest
      .spyOn(adapter, 'generate')
      .mockResolvedValue({ refreshToken: 'newRT', expiresAt: newExp });

    const rotated = await adapter.rotate('user-1', 'oldRT');

    expect(spyVerify).toHaveBeenCalledWith('user-1', 'oldRT');
    expect(repoMock.update).toHaveBeenCalledWith(
      { id: 'rt1' },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      { revokedAt: expect.any(Date) },
    );
    expect(spyGenerate).toHaveBeenCalledWith('user-1');
    expect(rotated).toEqual({ refreshToken: 'newRT', expiresAt: newExp });
  });
});
