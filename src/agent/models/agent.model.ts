import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { v4 } from 'uuid';
import { Brain } from './brain.model';

@ObjectType()
export class Agent {
  @Field((type) => GraphQLString)
  id = v4();

  brain: Brain;
}
