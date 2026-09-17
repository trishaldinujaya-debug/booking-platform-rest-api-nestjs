import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Booking Platform API')
    .setDescription(
      'REST API for managing services and customer bookings',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const protectedPaths = [
    '/auth/profile',
    '/services',
    '/services/{id}',
  ];

  for (const path of protectedPaths) {
    const pathItem = document.paths[path];

    if (!pathItem) {
      continue;
    }

    for (const method of [
      'get',
      'post',
      'patch',
      'delete',
    ] as const) {
      const operation = pathItem[method];

      if (operation) {
        operation.security = [
          {
            bearer: [],
          },
        ];
      }
    }
  }

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();