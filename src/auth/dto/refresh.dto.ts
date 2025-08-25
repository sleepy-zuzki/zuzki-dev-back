import { IsString, IsUUID, MinLength } from 'class-validator';

export class RefreshDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @MinLength(10)
  refreshToken!: string;
}
