import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ServicesModule } from './services/services.module.js';
import { BookingsModule } from './bookings/bookings.module.js';

@Module({
  imports: [PrismaModule, AuthModule, ServicesModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}