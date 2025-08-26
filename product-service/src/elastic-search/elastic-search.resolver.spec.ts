import { Test, TestingModule } from '@nestjs/testing';
import { ElasticSearchResolver } from './elastic-search.resolver';
import { ElasticSearchService } from './elastic-search.service';

describe('ElasticSearchResolver', () => {
  let resolver: ElasticSearchResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElasticSearchResolver, ElasticSearchService],
    }).compile();

    resolver = module.get<ElasticSearchResolver>(ElasticSearchResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
