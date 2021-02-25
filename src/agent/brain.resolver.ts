import { Query, Resolver } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';

import { Brain } from './models/brain.model';
import { BrainService } from './services/brain.service';

@Resolver((_) => Brain)
export class BrainResolver {
  constructor(private readonly brainService: BrainService) {}

  @Query(() => GraphQLString)
  async getAvailableBrains() {
    return this.brainService.getAvailableBrains();
  }
}
