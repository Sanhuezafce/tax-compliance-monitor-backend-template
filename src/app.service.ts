// src/app.module.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'For Documentation look at README and types definitions in src/types';
  }
}
