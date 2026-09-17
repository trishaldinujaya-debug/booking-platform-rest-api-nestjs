import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ServicesService } from './services.service.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';

@ApiTags('Services')
@ApiBearerAuth('bearer')
@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Create a new service',
    description: 'Creates a service for the authenticated user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Service created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid service data.',
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token is missing or invalid.',
  })
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @Request() request: { user: { userId: number } },
  ) {
    return this.servicesService.create(
      createServiceDto,
      request.user.userId,
    );
  }

  @Get()
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Get all services',
    description: 'Returns all services.',
  })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token is missing or invalid.',
  })
  async findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Get a service by ID',
    description: 'Returns a specific service using its ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service retrieved successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token is missing or invalid.',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Update a service',
    description:
      'Updates a service owned by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service updated successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token is missing or invalid.',
  })
  @ApiResponse({
    status: 403,
    description:
      'User does not have permission to update this service.',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
    @Request() request: { user: { userId: number } },
  ) {
    return this.servicesService.update(
      id,
      updateServiceDto,
      request.user.userId,
    );
  }

  @Delete(':id')
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Delete a service',
    description:
      'Deletes a service owned by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service deleted successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token is missing or invalid.',
  })
  @ApiResponse({
    status: 403,
    description:
      'User does not have permission to delete this service.',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found.',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() request: { user: { userId: number } },
  ) {
    return this.servicesService.remove(
      id,
      request.user.userId,
    );
  }
}