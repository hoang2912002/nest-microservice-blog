import { Test, TestingModule } from '@nestjs/testing';
import { SupbaseService } from './supbase.service';

describe('SupbaseService', () => {
  let service: SupbaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupbaseService],
    }).compile();

    service = module.get<SupbaseService>(SupbaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
