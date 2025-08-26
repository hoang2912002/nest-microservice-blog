import { Injectable } from '@nestjs/common';
import { CreateElasticSearchInput } from './dto/create-elastic-search.input';
import { UpdateElasticSearchInput } from './dto/update-elastic-search.input';

@Injectable()
export class ElasticSearchService {
  create(createElasticSearchInput: CreateElasticSearchInput) {
    return 'This action adds a new elasticSearch';
  }

  findAll() {
    return `This action returns all elasticSearch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} elasticSearch`;
  }

  update(id: number, updateElasticSearchInput: UpdateElasticSearchInput) {
    return `This action updates a #${id} elasticSearch`;
  }

  remove(id: number) {
    return `This action removes a #${id} elasticSearch`;
  }
}
