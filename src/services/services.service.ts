import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto, userId: number) {
    const service = await this.prisma.db.orm.public.Service.create({
      title: createServiceDto.title,
      description: createServiceDto.description,
      duration: createServiceDto.duration,
      price: String(createServiceDto.price),
      isActive: createServiceDto.isActive ?? true,
      userId,
    });

    return service;
  }

  async findAll() {
    return this.prisma.db.orm.public.Service.all();
  }

  async findOne(id: number) {
    const services = await this.prisma.db.orm.public.Service
      .where({
        id,
      })
      .all();

    const service = services[0];

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
    userId: number,
  ) {
    const service = await this.findOne(id);

    if (service.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this service',
      );
    }

    const updateData: {
      title?: string;
      description?: string;
      duration?: number;
      price?: string;
      isActive?: boolean;
    } = {};

    if (updateServiceDto.title !== undefined) {
      updateData.title = updateServiceDto.title;
    }

    if (updateServiceDto.description !== undefined) {
      updateData.description = updateServiceDto.description;
    }

    if (updateServiceDto.duration !== undefined) {
      updateData.duration = updateServiceDto.duration;
    }

    if (updateServiceDto.price !== undefined) {
      updateData.price = String(updateServiceDto.price);
    }

    if (updateServiceDto.isActive !== undefined) {
      updateData.isActive = updateServiceDto.isActive;
    }

    return this.prisma.db.orm.public.Service
      .where({
        id: service.id,
      })
      .update(updateData);
  }

  async remove(id: number, userId: number) {
    const service = await this.findOne(id);

    if (service.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this service',
      );
    }

    await this.prisma.db.orm.public.Service
      .where({
        id: service.id,
      })
      .delete();

    return {
      message: 'Service deleted successfully',
    };
  }
}