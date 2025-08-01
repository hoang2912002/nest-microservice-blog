import { Test, TestingModule } from '@nestjs/testing';
import { ChatMessageGateway } from './chat-message.gateway';
import { ChatMessageService } from './chat-message.service';

describe('ChatMessageGateway', () => {
  let gateway: ChatMessageGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatMessageGateway, ChatMessageService],
    }).compile();

    gateway = module.get<ChatMessageGateway>(ChatMessageGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
