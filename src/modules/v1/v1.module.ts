import { Module } from '@nestjs/common';
import { HelloController } from './hello/hello.controller';
import { HelloService } from './hello/hello.service';
import { HealthController } from './health/health.controller';

@Module({
  imports: [],
  controllers: [HelloController, HealthController],
  providers: [HelloService],
  exports: [],
})
export class V1Module {}
