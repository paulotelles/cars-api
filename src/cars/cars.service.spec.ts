import { Car, CarDocument } from './model/cars.model';
import { Test, TestingModule } from '@nestjs/testing';

import { CarFixture } from '../../test/fixture/cars.fixture';
import { CarsService } from './cars.service';
import { InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('CarsService', () => {
  let service: CarsService;
  let model: Model<CarDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarsService,
        {
          provide: getModelToken(Car.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<CarsService>(CarsService);
    model = module.get<Model<CarDocument>>(getModelToken(Car.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should sucessfully create a new car', async () => {
    jest
      .spyOn(model, 'create')
      .mockImplementationOnce(() =>
        Promise.resolve(CarFixture.getCarsFixture()),
      );
    const newCar = await service.create(CarFixture.getRequestCarsFixture());
    expect(newCar).toEqual(CarFixture.getCarsFixture());
  });

  it('Should unsucessfully create a new car', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() => false);

    await expect(
      service.create(CarFixture.getRequestCarsFixture()),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
