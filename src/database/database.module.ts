import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from '../config/configuration.module';
import { ConfigurationService } from '../config/configuration.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: (config: ConfigurationService) => {
        const sslValue = config.getPostgresSsl();

        return {
          type: 'postgres',
          host: config.getString('POSTGRES_HOST', 'localhost'),
          port: config.getNumber('POSTGRES_PORT', 5432),
          username: config.getString('POSTGRES_USER', 'postgres'),
          password: config.getString('POSTGRES_PASSWORD', 'postgres'),
          database: config.getString('POSTGRES_DB', 'postgres'),
          autoLoadEntities: true,
          synchronize: config.getBoolean('TYPEORM_SYNC', false),
          logging: config.getBoolean('TYPEORM_LOGGING', false),
          ssl: sslValue,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
