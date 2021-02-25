import { v4 } from 'uuid';
import { Brain } from './brain.model';

export class Agent {
  id = v4();

  brain: Brain;

}
