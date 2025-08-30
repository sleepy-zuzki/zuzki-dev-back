import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { ACCESS_TOKEN_SERVICE } from '@application/auth/ports/auth.tokens';
import { ConfigurationModule } from '@config/configuration.module';
import { ConfigurationService } from '@config/configuration.service';

import { JwtAccessTokenAdapter } from './jwt-access-token.adapter';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigurationService],
      useFactory: (config: ConfigurationService) => ({
        secret: config.getString('APP_JWT_SECRET'),
        signOptions: {
          algorithm: 'HS256',
        },
      }),
    }),
    ConfigurationModule,
  ],
  providers: [
    {
      provide: ACCESS_TOKEN_SERVICE,
      useFactory: (jwt: JwtService) => new JwtAccessTokenAdapter(jwt),
      inject: [JwtService],
    },
  ],
  exports: [JwtModule, ACCESS_TOKEN_SERVICE],
})
export class JwtAccessTokenInfrastructureModule {}
