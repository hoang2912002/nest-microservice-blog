import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { RedisService } from './redis.service';
import { CreateRediDto } from './dto/create-redi.dto';
import { UpdateRediDto } from './dto/update-redi.dto';

@WebSocketGateway()
export class RedisGateway {
  constructor(private readonly redisService: RedisService) {}

  // @SubscribeMessage('createRedi')
  // create(@MessageBody() createRediDto: CreateRediDto) {
  //   return this.redisService.create(createRediDto);
  // }

}
