import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { StacksService } from '../services/stacks.service';
import { StackEntity } from '../../../../core/database/entities';
import { CreateStackDto } from '../dto/create-stack.dto';
import { UpdateStackDto } from '../dto/update-stack.dto';

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

  @Post()
  async create(@Body() dto: CreateStackDto): Promise<StackEntity> {
    return this.stacksService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStackDto,
  ): Promise<StackEntity> {
    const updated = await this.stacksService.update(id, dto);
    if (!updated) throw new NotFoundException('Stack no encontrado');
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ success: true }> {
    const ok = await this.stacksService.remove(id);
    if (!ok) throw new NotFoundException('Stack no encontrado');
    return { success: true };
  }
}
