import { Module } from '@nestjs/common';
import { V1Module } from './modules/v1/v1.module';
import { AppLogger } from './common/logger/app-logger.service';

@Module({
  imports: [V1Module],
  controllers: [],
  providers: [AppLogger],
  exports: [AppLogger],
})
export class AppModule {}
