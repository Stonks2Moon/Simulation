import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Brain {

    @Field()
    name: string;

    decide() {

    }

    act() {
        
    }
}
