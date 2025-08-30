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
import { PinoLogger } from 'nestjs-pino';

import { toFileView } from '@application/portfolio/mappers/file.mappers';
import { FilesService } from '@application/portfolio/services/files.service';

import { CreateFileDto } from '../dto/create-file.dto';
import { FileResponseDto } from '../dto/file.response.dto';
import { UpdateFileDto } from '../dto/update-file.dto';

@Controller({ path: 'portfolio/files', version: '1' })
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(FilesController.name);
  }

  @Get()
  async list(): Promise<FileResponseDto[]> {
    const items = await this.filesService.findAll();
    this.logger.debug({ count: items.length }, 'Listado de archivos');
    return items.map(toFileView);
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FileResponseDto> {
    this.logger.info({ id }, 'Buscando archivo por id');
    const file = await this.filesService.findOne(id);
    if (!file) {
      this.logger.warn({ id }, 'Archivo no encontrado');
      throw new NotFoundException('Archivo no encontrado');
    }
    this.logger.debug({ id: file.id }, 'Archivo encontrado');
    return toFileView(file);
  }

  @Post()
  async create(@Body() dto: CreateFileDto): Promise<FileResponseDto> {
    this.logger.info(
      { url: dto.url, projectId: dto.projectId },
      'Creando archivo',
    );
    const created = await this.filesService.create({
      url: dto.url,
      provider: dto.provider ?? null,
      mimeType: dto.mimeType ?? null,
      sizeBytes: dto.sizeBytes ?? null,
      projectId: dto.projectId ?? null,
    });
    this.logger.info({ id: created.id }, 'Archivo creado');
    return toFileView(created);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFileDto,
  ): Promise<FileResponseDto> {
    this.logger.info({ id }, 'Actualizando archivo');
    const updated = await this.filesService.update(id, {
      url: dto.url,
      provider: dto.provider,
      mimeType: dto.mimeType,
      sizeBytes: dto.sizeBytes,
      projectId: dto.projectId,
    });
    if (!updated) {
      this.logger.warn({ id }, 'Archivo no encontrado para actualizar');
      throw new NotFoundException('Archivo no encontrado');
    }
    this.logger.info({ id: updated.id }, 'Archivo actualizado');
    return toFileView(updated);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: true }> {
    this.logger.info({ id }, 'Eliminando archivo');
    const ok = await this.filesService.remove(id);
    if (!ok) {
      this.logger.warn({ id }, 'Archivo no encontrado para eliminar');
      throw new NotFoundException('Archivo no encontrado');
    }
    this.logger.info({ id }, 'Archivo eliminado');
    return { success: true };
  }
}
