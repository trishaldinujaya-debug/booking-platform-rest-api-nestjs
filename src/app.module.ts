import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ServicesModule } from './services/services.module.js';
import { BookingsModule } from './bookings/bookings.module.js';

class EnvironmentVariables {
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsNotEmpty()
  DATABASE_URL!: string;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const validatedConfig = plainToInstance(
          EnvironmentVariables,
          config,
        );

        const errors = validateSync(validatedConfig, {
          skipMissingProperties: false,
        });

        if (errors.length > 0) {
          throw new Error(
            `Environment validation failed: ${errors
              .map((error) => Object.values(error.constraints ?? {}))
              .flat()
              .join(', ')}`,
          );
        }

        return config;
      },
    }),
    PrismaModule,
    AuthModule,
    ServicesModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}