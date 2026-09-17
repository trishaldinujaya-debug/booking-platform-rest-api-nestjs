import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {
            db: {
              orm: {
                public: {
                  User: {
                    all: async () => [],
                  },
                },
              },
            },
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the API status message', async () => {
      await expect(appController.getHello()).resolves.toBe(
        'Booking Platform API + PostgreSQL + Prisma 8 is working. Users: 0',
      );
    });
  });
});