import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Customer full name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  customerName: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Customer email address',
  })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({
    example: '+94771234567',
    description: 'Customer phone number',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  customerPhone: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the service being booked',
  })
  @IsInt()
  @Min(1)
  serviceId: number;

  @ApiProperty({
    example: '2026-09-20',
    description: 'Booking date in ISO date format',
  })
  @IsDateString()
  bookingDate: string;

  @ApiProperty({
    example: '10:00',
    description: 'Booking time in HH:mm format',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'bookingTime must be in HH:mm format',
  })
  bookingTime: string;

  @ApiPropertyOptional({
    example: 'Please call before arrival.',
    description: 'Optional booking notes',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}