import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AppService {
  /**
   *
   */
  constructor(private readonly logger: PinoLogger) {}
  getHello(): string {
    this.logger.info('Hello World called');
    return 'Hello World!';
  }
}
