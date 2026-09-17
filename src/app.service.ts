import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello(): Promise<string> {
    const users = await this.prisma.db.orm.public.User.all();

    return `Booking Platform API + PostgreSQL + Prisma 8 is working. Users: ${users.length}`;
  }
}