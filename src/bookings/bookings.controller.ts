import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { GetBookingsQueryDto } from './dto/get-bookings-query.dto.js';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto.js';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new booking',
    description:
      'Creates a booking for an existing service. Customers do not need authentication.',
  })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid booking data or booking date is in the past.',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Booking slot is already booked.',
  })
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all bookings',
    description:
      'Returns bookings with optional status filtering and pagination.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters.',
  })
  async findAll(@Query() query: GetBookingsQueryDto) {
    return this.bookingsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a booking by ID',
    description: 'Returns a specific booking using its ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update booking status',
    description:
      'Updates the status of a booking. Cancelled bookings cannot be completed.',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking status updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status transition.',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found.',
  })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(
      id,
      updateBookingStatusDto,
    );
  }

  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Cancel a booking',
    description:
      'Cancels a booking. Completed bookings cannot be cancelled.',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Completed bookings cannot be cancelled.',
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found.',
  })
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.cancel(id);
  }
}