import { Injectable } from '@nestjs/common';
import { CreateChatAiMessageDto } from './dto/create-chat-ai-message.dto';
import { ChatOpenAI } from "@langchain/openai";
import { getTopPostsTool, getUserInfoTool } from 'src/util/helper';
import { createStructuredChatAgent, AgentExecutor } from "langchain/agents";
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';

@Injectable()
export class ChatAiMessageService {
  private model: ChatOpenAI;
  private executor: AgentExecutor;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_SECRET_KEY,
    });

    this.initAgent();
  }

  private async initAgent() {
    const tools = [getTopPostsTool, getUserInfoTool];

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `Bạn là trợ lý AI hỗ trợ viết blog, trả lời bằng tiếng Việt.
Bạn có thể dùng công cụ sau: {tool_names}.
Chi tiết: {tools}`,
      ],
      ['human', '{input}'],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);

    const agent = await createStructuredChatAgent({
      llm: this.model,
      tools,
      prompt,
    });

    this.executor = new AgentExecutor({
      agent,
      tools,
      verbose: true,
    });
  }

  async sendMessage({ message }: CreateChatAiMessageDto) {
    if (!this.executor) {
      await this.initAgent();
    }
    // ❌ không truyền agent_scratchpad nữa
    const result = await this.executor.invoke({ input: message, agent_scratchpad: [] });
    return result.output;
  }
}
