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
import { FilesService } from '../services/files.service';
import { FileEntity } from '../../../../core/database/entities';
import { CreateFileDto } from '../dto/create-file.dto';
import { UpdateFileDto } from '../dto/update-file.dto';

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

  @Post()
  async create(@Body() dto: CreateFileDto): Promise<FileEntity> {
    return this.filesService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFileDto,
  ): Promise<FileEntity> {
    const updated = await this.filesService.update(id, dto);
    if (!updated) throw new NotFoundException('Archivo no encontrado');
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ success: true }> {
    const ok = await this.filesService.remove(id);
    if (!ok) throw new NotFoundException('Archivo no encontrado');
    return { success: true };
  }
}
