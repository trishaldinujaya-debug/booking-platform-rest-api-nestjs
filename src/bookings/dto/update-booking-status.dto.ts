import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export class UpdateBookingStatusDto {
  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    description: 'New status for the booking',
  })
  @IsEnum(BookingStatus)
  status: BookingStatus;
}