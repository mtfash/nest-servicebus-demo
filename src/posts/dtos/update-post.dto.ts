import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: 'This is a sample post content' })
  @IsString()
  content: string;
}
