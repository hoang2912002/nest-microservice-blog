import { Test, TestingModule } from '@nestjs/testing';
import { SupbaseResolver } from './supbase.resolver';
import { SupbaseService } from './supbase.service';

describe('SupbaseResolver', () => {
  let resolver: SupbaseResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupbaseResolver, SupbaseService],
    }).compile();

    resolver = module.get<SupbaseResolver>(SupbaseResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
