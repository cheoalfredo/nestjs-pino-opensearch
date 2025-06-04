import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { OpenSearchTransport } from './opensearch-transport';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: [
        {
          level: 'debug',
        },
        new OpenSearchTransport({
          opensearchConfig: {
            node: 'https://xxxxxxx.ap-south-1.es.amazonaws.com',
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
