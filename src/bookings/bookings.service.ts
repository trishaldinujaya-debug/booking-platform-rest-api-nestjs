import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Temporal } from '@js-temporal/polyfill';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { GetBookingsQueryDto } from './dto/get-bookings-query.dto.js';
import {
  BookingStatus,
  UpdateBookingStatusDto,
} from './dto/update-booking-status.dto.js';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      bookingDate,
      bookingTime,
      notes,
    } = createBookingDto;

    const services = await this.prisma.db.orm.public.Service
      .where({
        id: serviceId,
      })
      .all();

    const service = services[0];

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (!service.isActive) {
      throw new BadRequestException('Service is not active');
    }

    const requestedDate = new Date(bookingDate);

    if (Number.isNaN(requestedDate.getTime())) {
      throw new BadRequestException('Invalid booking date');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    requestedDate.setHours(0, 0, 0, 0);

    if (requestedDate < today) {
      throw new BadRequestException(
        'Booking date cannot be in the past',
      );
    }

    const bookingDateInstant = Temporal.Instant.from(
      `${bookingDate}T00:00:00Z`,
    );

    const existingBookings = await this.prisma.db.orm.public.Booking
      .where({
        serviceId,
        bookingDate: bookingDateInstant,
        bookingTime,
      })
      .all();

    const activeBookingExists = existingBookings.some(
      (booking) => booking.status !== BookingStatus.CANCELLED,
    );

    if (activeBookingExists) {
      throw new ConflictException(
        'Booking slot is already booked',
      );
    }

    return this.prisma.db.orm.public.Booking.create({
      customerName,
      customerEmail,
      customerPhone,
      bookingDate: bookingDateInstant,
      bookingTime,
      status: BookingStatus.PENDING,
      notes,
      serviceId,
    });
  }

  async findAll(query: GetBookingsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    let bookings = await this.prisma.db.orm.public.Booking.all();

    if (query.status) {
      bookings = bookings.filter(
        (booking) => booking.status === query.status,
      );
    }

    const total = bookings.length;

    const paginatedBookings = bookings.slice(
      skip,
      skip + limit,
    );

    return {
      data: paginatedBookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const bookings = await this.prisma.db.orm.public.Booking
      .where({
        id,
      })
      .all();

    const booking = bookings[0];

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async updateStatus(
    id: number,
    updateBookingStatusDto: UpdateBookingStatusDto,
  ) {
    const booking = await this.findOne(id);
    const newStatus = updateBookingStatusDto.status;

    if (
      booking.status === BookingStatus.CANCELLED &&
      newStatus === BookingStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Cancelled bookings cannot be completed',
      );
    }

    return this.prisma.db.orm.public.Booking
      .where({
        id: booking.id,
      })
      .update({
        status: newStatus,
      });
  }

  async cancel(id: number) {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException(
        'Booking is already cancelled',
      );
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException(
        'Completed bookings cannot be cancelled',
      );
    }

    return this.prisma.db.orm.public.Booking
      .where({
        id: booking.id,
      })
      .update({
        status: BookingStatus.CANCELLED,
      });
  }
}
