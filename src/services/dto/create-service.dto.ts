import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    example: 'Web Development Consultation',
    description: 'Service title',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    example: 'One-hour consultation for web development projects.',
    description: 'Service description',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    example: 60,
    description: 'Service duration in minutes',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({
    example: 5000,
    description: 'Service price',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Whether the service is currently active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}