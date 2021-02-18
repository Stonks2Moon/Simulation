import { Brain } from "./brain.dto";
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Agent {

    @Field(type => Int)
    id: number;


}
