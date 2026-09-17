import {
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { BookingStatus } from './update-booking-status.dto.js';

export class GetBookingsQueryDto {
  @ApiPropertyOptional({
    enum: BookingStatus,
    example: BookingStatus.PENDING,
    description: 'Filter bookings by status',
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Page number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Number of bookings per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}