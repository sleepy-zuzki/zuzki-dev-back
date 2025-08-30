import { Module } from '@nestjs/common';

import { CatalogCompositionModule } from '@infra/composition/catalog.composition.module';

@Module({
  imports: [CatalogCompositionModule],
  exports: [CatalogCompositionModule],
})
export class CatalogApplicationModule {}
