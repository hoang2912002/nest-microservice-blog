import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ElasticSearchService } from './elastic-search.service';
import { ElasticSearch } from './entities/elastic-search.entity';
import { CreateElasticSearchInput } from './dto/create-elastic-search.input';
import { UpdateElasticSearchInput } from './dto/update-elastic-search.input';

@Resolver(() => ElasticSearch)
export class ElasticSearchResolver {
  constructor(private readonly elasticSearchService: ElasticSearchService) {}

  @Mutation(() => ElasticSearch)
  createElasticSearch(@Args('createElasticSearchInput') createElasticSearchInput: CreateElasticSearchInput) {
    return this.elasticSearchService.create(createElasticSearchInput);
  }

  @Query(() => [ElasticSearch], { name: 'elasticSearch' })
  findAll() {
    return this.elasticSearchService.findAll();
  }

  @Query(() => ElasticSearch, { name: 'elasticSearch' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.elasticSearchService.findOne(id);
  }

  @Mutation(() => ElasticSearch)
  updateElasticSearch(@Args('updateElasticSearchInput') updateElasticSearchInput: UpdateElasticSearchInput) {
    return this.elasticSearchService.update(updateElasticSearchInput.id, updateElasticSearchInput);
  }

  @Mutation(() => ElasticSearch)
  removeElasticSearch(@Args('id', { type: () => Int }) id: number) {
    return this.elasticSearchService.remove(id);
  }
}
