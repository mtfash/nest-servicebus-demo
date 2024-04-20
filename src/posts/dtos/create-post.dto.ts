import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'This is a sample post content' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  author: string;
}
