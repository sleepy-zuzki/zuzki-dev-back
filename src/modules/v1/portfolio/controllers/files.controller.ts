import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesService } from '../services/files.service';
import { FileEntity } from '../../../../core/database/entities';

@Controller({ path: 'portfolio/files', version: '1' })
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  async list(): Promise<FileEntity[]> {
    return this.filesService.findAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<FileEntity> {
    const file = await this.filesService.findOne(id);
    if (!file) throw new NotFoundException('Archivo no encontrado');
    return file;
  }
}
