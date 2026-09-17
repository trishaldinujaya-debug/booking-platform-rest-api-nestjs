import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { db } from './db.js';

@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly db = db;

  async onModuleDestroy(): Promise<void> {
    await this.db.close();
  }
}