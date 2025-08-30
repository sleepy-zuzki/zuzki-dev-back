import { Module } from '@nestjs/common';

import { PortfolioCompositionModule } from '@infra/composition/portfolio.composition.module';

@Module({
  imports: [PortfolioCompositionModule],
  exports: [PortfolioCompositionModule],
})
export class PortfolioApplicationModule {}
