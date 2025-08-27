import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '../entities/auth/refresh-token.entity';
import { REFRESH_TOKEN_SERVICE } from '../../../../application/auth/ports/auth.tokens';
import { RefreshTokenTypeormAdapter } from './refresh-token.repository.adapter';
import { HASHING_SERVICE } from '../../../../application/security/ports/security.tokens';
import { HashingInfrastructureModule } from '../../../../infrastructure/security/argon2/hashing.infrastructure.module';
import { ConfigurationModule } from '../../../../config/configuration.module';
import { ConfigurationService } from '../../../../config/configuration.service';
import { Repository } from 'typeorm';
import { HashingPort } from '../../../../application/security/ports/hashing.port';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    HashingInfrastructureModule,
    ConfigurationModule,
  ],
  providers: [
    {
      provide: REFRESH_TOKEN_SERVICE,
      useFactory: (
        repo: Repository<RefreshTokenEntity>,
        hashing: HashingPort,
        config: ConfigurationService,
      ) => new RefreshTokenTypeormAdapter(repo, hashing, config),
      inject: [
        RefreshTokenEntity.name + 'Repository',
        HASHING_SERVICE,
        ConfigurationService,
      ],
    },
  ],
  exports: [REFRESH_TOKEN_SERVICE],
})
export class RefreshTokenInfrastructureModule {}
