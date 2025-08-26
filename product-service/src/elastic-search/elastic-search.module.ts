import { Module } from '@nestjs/common';
import { ElasticSearchService } from './elastic-search.service';
import { ElasticSearchResolver } from './elastic-search.resolver';
import { Client } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'ELASTIC_CLIENT',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return  new Client({
          node: configService.get<string>('ELASTIC_SEARCH_ENDPOINT'), // hoặc http://elasticsearch:9200 nếu chạy Docker network
          auth: {
            // apiKey: configService.get<string>('ELASTICSEARCH_API_KEY')!,
            username: configService.get<string>('ELASTICSEARCH_USERNAME')!,
            password: configService.get<string>('ELASTICSEARCH_PASSWORD')!
          },
        });
      },
    },
  ],
  exports: ['ELASTIC_CLIENT'],

})
export class ElasticSearchModule {}
