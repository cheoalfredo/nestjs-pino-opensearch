import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { OpenSearchTransport } from './custom-transport';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: [
        {
          level: 'debug',
        },
        new OpenSearchTransport({
          opensearchConfig: {
            node: 'https://search-amplify-opense-5mnaxuju7qz2-dklzddit56lsr436ptoc2oyqqu.ap-south-1.es.amazonaws.com',
          },
          indexName: 'nestjs-app-logs',
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
