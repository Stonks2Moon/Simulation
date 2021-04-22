import { Test, TestingModule } from '@nestjs/testing';
import { SzenarioController } from './szenario.controller';
import { SzenarioService } from './szenario.service';

const mockSzenarios = { id: 1, name: 'testszenario', data: [] };

describe('SzenarioController', () => {
  let controller: SzenarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SzenarioController],
      providers: [
        {
          provide: SzenarioService,
          useValue: {
            getSzenarioProgress: async () => 0,
            get: (id?: number) => mockSzenarios,
          } as SzenarioService,
        },
      ],
    }).compile();

    controller = module.get<SzenarioController>(SzenarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get available szenarios', () => {
    const sz = controller.getAvailable();

    expect(sz).toEqual(mockSzenarios);
  });

  it('should get szenario progress', async () => {
    const p = await controller.getSzenarioProgress();
    expect(p).toBe(0)
  });
});
