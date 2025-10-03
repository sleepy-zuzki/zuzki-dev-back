import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigurationModule } from '@config/configuration.module';
import { ConfigurationService } from '@config/configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: (config: ConfigurationService) => {
        const logger = new Logger('DatabaseModule');
        const sslValue = config.getPostgresSsl();

        const host = config.getString('POSTGRES_HOST', 'localhost');
        const port = config.getNumber('POSTGRES_PORT', 5432);
        const username = config.getString('POSTGRES_USER', 'postgres');
        const password = config.getString('POSTGRES_PASSWORD', 'postgres');
        const database = config.getString('POSTGRES_DB', 'postgres');
        const schema = 'portfolio';
        const synchronize = config.getBoolean('TYPEORM_SYNC', false);
        const logging = config.getBoolean('TYPEORM_LOGGING', false);

        // Log seguro sin exponer secretos
        logger.log(`Intentando conectar a Postgres`);
        logger.log(
          JSON.stringify(
            {
              host,
              port,
              database,
              schema,
              ssl: sslValue,
              synchronize,
              logging,
              usernameDefined: Boolean(username),
              passwordDefined: Boolean(password),
            },
            null,
            2,
          ),
        );

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          schema,
          autoLoadEntities: true,
          synchronize,
          logging,
          ssl: sslValue,
          extra: {
            poolMode: config.getString('POSTGRES_POOL_MODE', 'session'),
            max: 5,
            idleTimeoutMillis: 10000,
            connectionTimeoutMillis: 10000,
          },
          retryAttempts: 3,
          retryDelay: 2000,
          logger: 'advanced-console',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
