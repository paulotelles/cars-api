import { MockType, carsServiceMockFactory } from '../../test/test-helper';
import { Test, TestingModule } from '@nestjs/testing';

import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

describe('RecordsController', () => {
  let controller: CarsController;
  let service: MockType<CarsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CarsService,
          useFactory: carsServiceMockFactory,
        },
      ],
      controllers: [CarsController],
    }).compile();

    controller = module.get<CarsController>(CarsController);
    service = module.get(CarsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
