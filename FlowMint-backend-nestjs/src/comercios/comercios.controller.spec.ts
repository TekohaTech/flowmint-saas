import { Test, TestingModule } from '@nestjs/testing';
import { ComerciosController } from './comercios.controller';

describe('ComerciosController', () => {
  let controller: ComerciosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComerciosController],
    }).compile();

    controller = module.get<ComerciosController>(ComerciosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
