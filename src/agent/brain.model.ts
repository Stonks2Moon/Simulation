import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';

@ObjectType()
export class Brain {
  @Field((_) => GraphQLString)
  name = this.constructor.name;
}
