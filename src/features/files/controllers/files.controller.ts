import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseFilePipe,
  MaxFileSizeValidator,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PinoLogger } from 'nestjs-pino';

import { FileEntity } from '../entities/file.entity';
import { FilesService } from '../services/files.service';

@Controller({ path: 'files', version: '1' })
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(FilesController.name);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<FileEntity> {
    this.logger.info({ filename: file.originalname }, 'Uploading file');
    const result = await this.filesService.create({
      body: file.buffer,
      fileName: file.originalname,
      fileType: file.mimetype,
      sizeBytes: file.size,
    });
    return result;
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<FileEntity> {
    const file = await this.filesService.findOne(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: true }> {
    const deleted = await this.filesService.remove(id);
    if (!deleted) {
      throw new NotFoundException('File not found');
    }
    return { success: true };
  }
}
