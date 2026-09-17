import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import {
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class UpdateServiceDto {
  @ApiPropertyOptional({
    example: 'Advanced Web Development Consultation',
    description: 'Updated service title',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @ApiPropertyOptional({
    example: 'Updated consultation description.',
    description: 'Updated service description',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    example: 90,
    description: 'Updated service duration in minutes',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({
    example: 7500,
    description: 'Updated service price',
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the service is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}