import { Test, TestingModule } from '@nestjs/testing';
import { ChatAiMessageController } from './chat-ai-message.controller';
import { ChatAiMessageService } from './chat-ai-message.service';

describe('ChatAiMessageController', () => {
  let controller: ChatAiMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatAiMessageController],
      providers: [ChatAiMessageService],
    }).compile();

    controller = module.get<ChatAiMessageController>(ChatAiMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
