import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';

import { Public } from '@features/auth/decorators/public.decorator';

import { ContactRequestDto } from '../dto/contact-request.dto';
import { ContactService } from '../services/contact.service';

@Controller({ path: 'contact', version: '1' })
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    dto: ContactRequestDto,
  ): Promise<void> {
    await this.contactService.execute(dto);
  }
}
