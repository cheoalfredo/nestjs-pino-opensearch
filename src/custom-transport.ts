/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/common/logger/rest-api.transport.ts
import { Writable } from 'stream';
import { Client, ClientOptions } from '@opensearch-project/opensearch';

const AWS = require('aws-sdk');
const createAwsConnector = require('aws-opensearch-connector');

interface OpenSearchTransportOptions {
  opensearchConfig: ClientOptions;
  indexName: string;
}

export class OpenSearchTransport extends Writable {
  private readonly client: Client;
  private readonly indexName: string;

  constructor(options: OpenSearchTransportOptions) {
    super({ objectMode: true }); // Important: objectMode allows Pino to pass full log objects
    if (!options.opensearchConfig || !options.indexName) {
      throw new Error(
        'OpenSearchTransport: opensearchConfig and indexName are required.',
      );
    }
    this.indexName = options.indexName;
    this.client = new Client({
      ...createAwsConnector(AWS.config),
      node: options.opensearchConfig.node,
    });
  }

  _write(chunk: any, encoding: BufferEncoding, callback: () => void): void {
    const logEntry = chunk;

    this.sendToOpenSearch(logEntry).finally(() => {
      callback();
    });
  }

  private async sendToOpenSearch(logEntry: any): Promise<void> {
    try {
      const response = await this.client.index({
        index: this.indexName,
        id: logEntry.id || undefined, // Optional: Use a custom ID if provided
        body: logEntry,
      });

      if (
        response.statusCode &&
        (response.statusCode < 200 || response.statusCode >= 300)
      ) {
        console.error(
          `OpenSearchTransport: Failed to send log to OpenSearch. Status: ${response.statusCode}`,
          `Response: ${JSON.stringify(response.body)}`,
          `Log Entry: ${JSON.stringify(logEntry)}`,
        );
      } else {
        // console.log(`OpenSearchTransport: Log sent successfully. ID: ${response.body._id}`);
      }
    } catch (error) {
      // Log network errors or other exceptions during the OpenSearch call
      console.error(
        `OpenSearchTransport: Error sending log to OpenSearch: ${error.message}`,
        `Log Entry: ${JSON.stringify(logEntry)}`,
        error,
      );
    }
  }
}
