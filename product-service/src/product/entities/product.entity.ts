import { ObjectType, Field, Int, Directive } from '@nestjs/graphql';

@ObjectType()
//Khi dùng subgraph trong microservice apollo federation thì cần phải khai báo @key
//Còn được gọi là "indentity field" để apollo federation biết cách định danh entity này 
// khi mà hợp nhất schema giữa cacs subgraph

//@key directive xác định field nào là khóa chính duy nhất để định danh bản ghi giữa các service khác nhau.

@Directive('@key(fields: "id")')
export class Product {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
