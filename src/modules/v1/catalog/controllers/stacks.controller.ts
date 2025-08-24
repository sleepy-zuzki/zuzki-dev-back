import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { StacksService } from '../services/stacks.service';
import { StackEntity } from '../../../../core/database/entities';

@Controller({ path: 'catalog/stacks', version: '1' })
export class StacksController {
  constructor(private readonly stacksService: StacksService) {}

  @Get()
  async list(): Promise<StackEntity[]> {
    return this.stacksService.findAll();
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string): Promise<StackEntity> {
    const stack = await this.stacksService.findBySlug(slug);
    if (!stack) throw new NotFoundException('Stack no encontrado');
    return stack;
  }
}
