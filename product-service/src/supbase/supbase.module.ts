import { Module } from '@nestjs/common';
import { SupbaseService } from './supbase.service';
import { SupbaseResolver } from './supbase.resolver';

@Module({
  providers: [SupbaseResolver, SupbaseService],
})
export class SupbaseModule {}
