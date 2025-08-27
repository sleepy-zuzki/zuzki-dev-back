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
import { StacksService } from '@application/catalog/services/stacks.service';
import { CreateStackDto } from '@interfaces/http/v1/catalog/dto/create-stack.dto';
import { UpdateStackDto } from '@interfaces/http/v1/catalog/dto/update-stack.dto';
import { StackResponseDto } from '@interfaces/http/v1/catalog/dto/stack.response.dto';
import { toStackView } from '@application/catalog/mappers/stack.mappers';
import { PinoLogger } from 'nestjs-pino';

@Controller({ path: 'catalog/stacks', version: '1' })
export class StacksController {
  constructor(
    private readonly stacksService: StacksService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(StacksController.name);
  }

  @Get()
  async list(): Promise<StackResponseDto[]> {
    const items = await this.stacksService.findAll();
    this.logger.debug({ count: items.length }, 'Listado de stacks');
    return items.map(toStackView);
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string): Promise<StackResponseDto> {
    this.logger.info({ slug }, 'Buscando stack por slug');
    const stack = await this.stacksService.findBySlug(slug);
    if (!stack) {
      this.logger.warn({ slug }, 'Stack no encontrado');
      throw new NotFoundException('Stack no encontrado');
    }
    this.logger.debug({ id: stack.id, slug }, 'Stack encontrado');
    return toStackView(stack);
  }

  @Post()
  async create(@Body() dto: CreateStackDto): Promise<StackResponseDto> {
    this.logger.info({ slug: dto.slug }, 'Creando stack');
    const created = await this.stacksService.create({
      name: dto.name,
      slug: dto.slug,
    });
    this.logger.info({ id: created.id, slug: created.slug }, 'Stack creado');
    return toStackView(created);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStackDto,
  ): Promise<StackResponseDto> {
    this.logger.info({ id }, 'Actualizando stack');
    const updated = await this.stacksService.update(id, {
      name: dto.name,
      slug: dto.slug,
    });
    if (!updated) {
      this.logger.warn({ id }, 'Stack no encontrado para actualizar');
      throw new NotFoundException('Stack no encontrado');
    }
    this.logger.info({ id: updated.id }, 'Stack actualizado');
    return toStackView(updated);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: true }> {
    this.logger.info({ id }, 'Eliminando stack');
    const ok = await this.stacksService.remove(id);
    if (!ok) {
      this.logger.warn({ id }, 'Stack no encontrado para eliminar');
      throw new NotFoundException('Stack no encontrado');
    }
    this.logger.info({ id }, 'Stack eliminado');
    return { success: true };
  }
}
