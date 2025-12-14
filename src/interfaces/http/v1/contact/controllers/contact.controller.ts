import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';

import { Public } from '@features/auth/decorators/public.decorator';
import { SubmitContactService } from '@application/contact/services/submit-contact.service';

import { ContactRequestDto } from '../dto/contact-request.dto';

@Controller({ path: 'contact', version: '1' })
export class ContactController {
  constructor(private readonly submitContactService: SubmitContactService) { }

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
    await this.submitContactService.execute(dto);
  }
}
