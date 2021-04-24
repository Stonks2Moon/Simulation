import { Test, TestingModule } from '@nestjs/testing';
import { SzenarioController } from './szenario.controller';
import { SzenarioService } from './szenario.service';
import { SzenarioStartDto } from './szenarioStart.dto';

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
            runSzenario: jest.fn,
            stopCurrentSzenario: jest.fn,
          },
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
    expect(p).toBe(0);
  });

  it('should start a szenario if needed and reject if no auth', async () => {
    expect(() =>
      controller.runSzenario(new SzenarioStartDto(), null),
    ).toThrowError();

    expect(
      controller.runSzenario(new SzenarioStartDto(), 'some Auth'),
    ).toBeTruthy();
  });

  it('should stop currrent scenarios', () => {
    expect(controller.stopCurrentSzenario()).toBeTruthy()
  });
});
