import { Test, TestingModule } from '@nestjs/testing';
import { ChatAiMessageService } from './chat-ai-message.service';

describe('ChatAiMessageService', () => {
  let service: ChatAiMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatAiMessageService],
    }).compile();

    service = module.get<ChatAiMessageService>(ChatAiMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
