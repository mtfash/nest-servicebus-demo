import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LikePostDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  likedBy: string;
}
