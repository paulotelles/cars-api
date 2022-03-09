import { Car, CarDocument } from './model/cars.model';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CarFixture } from '../../test/fixture/cars.fixture';
import { CarsService } from './cars.service';
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
            findById: jest.fn(),
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

  describe('test create function', () => {
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

  describe('test findOne function', () => {
    it('Should sucessfully find one car', async () => {
      jest
        .spyOn(model, 'findById')
        .mockResolvedValueOnce(CarFixture.getCarsFixture() as CarDocument);
      const newCar = await service.findOne(CarFixture.getCarsFixture()._id);
      expect(newCar).toEqual(CarFixture.getCarsFixture());
    });

    it('Should unsucessfully find one car', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);

      await expect(
        service.findOne(CarFixture.getCarsFixture()._id),
      ).rejects.toThrow(
        new NotFoundException(
          `No car was found with id ${CarFixture.getCarsFixture()._id}.`,
        ),
      );
    });
  });
  describe('test find function', () => {
    it('Should sucessfully find a car', async () => {
      jest
        .spyOn(model, 'find')
        .mockResolvedValueOnce(CarFixture.getAllCarsFixture());
      const newCars = await service.find();
      expect(newCars).toEqual(CarFixture.getAllCarsFixture());
    });

    it('Should unsucessfully find a car', async () => {
      jest.spyOn(model, 'find').mockResolvedValueOnce([]);

      await expect(service.find()).rejects.toThrow(
        new NotFoundException(`No car was found.`),
      );
    });
  });
});
