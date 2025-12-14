import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PinoLogger } from 'nestjs-pino';

import { UNASSOCIATED_FILES_PREFIX } from 'src/shared/constants/storage.constants';

import { FileResponseDto } from '../dto/file.response.dto';
import { UpdateFileDto } from '../dto/update-file.dto';
import { toFileView } from '../mappers/file.mappers';
import { FilesService } from '../services/files.service';

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
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.logger.info(
      {
        fileName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
      'Creando archivo',
    );
    const created = await this.filesService.create({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
      sizeBytes: file.size,
      pathPrefix: UNASSOCIATED_FILES_PREFIX,
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
