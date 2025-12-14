import { Module } from '@nestjs/common';

import { AuthModule } from '@features/auth/auth.module';
import { CatalogModule } from '@features/catalog/catalog.module';
import { ContactModule } from '@features/contact/contact.module';
import { FilesModule } from '@features/files/files.module';
import { HealthModule } from '@features/health/health.module';
import { ProjectsModule } from '@features/projects/projects.module';
import { StackModule } from '@features/stack/stack.module';
import { UsersModule } from '@features/users/users.module';

@Module({
  imports: [
    CatalogModule,
    FilesModule,
    ProjectsModule,
    StackModule,
    HealthModule,
    UsersModule,
    AuthModule,
    ContactModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class V1Module {}
