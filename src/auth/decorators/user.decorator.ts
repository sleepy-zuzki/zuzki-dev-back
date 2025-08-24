import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  <T = unknown>(_data: unknown, ctx: ExecutionContext): T | undefined => {
    const request = ctx.switchToHttp().getRequest<{ user?: T }>();
    return request.user;
  },
);
