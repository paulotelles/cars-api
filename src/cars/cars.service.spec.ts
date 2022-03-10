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
            findById: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            findOneAndRemove: jest.fn(),
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
  describe('test delete function', () => {
    it('Should sucessfully delete one car', async () => {
      const message = {
        message: `Sucessfully deleted car with id ${
          CarFixture.getCarsFixture()._id
        }`,
      };
      jest
        .spyOn(model, 'findOneAndRemove')
        .mockResolvedValueOnce(CarFixture.getCarsFixture());
      const newCar = await service.delete(CarFixture.getCarsFixture()._id);
      expect(newCar).toEqual(message);
    });

    it('Should unsucessfully find one car', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);

      await expect(
        service.delete(CarFixture.getCarsFixture()._id),
      ).rejects.toThrow(
        new NotFoundException(
          `No car was found with id ${CarFixture.getCarsFixture()._id}.`,
        ),
      );
    });
  });
  describe('test update function', () => {
    it('Should sucessfully update one car', async () => {
      const originalCar = CarFixture.getCarsFixture();
      const updatedCar: CarDocument = JSON.parse(JSON.stringify(originalCar));
      updatedCar.color = 'red';
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValueOnce(updatedCar);
      const newCar = await service.update(CarFixture.getCarsFixture()._id, {
        color: 'red',
      });
      expect(newCar).toEqual(updatedCar);
    });

    it('Should unsucessfully update one car', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValueOnce(null);

      await expect(
        service.update(CarFixture.getCarsFixture()._id, { color: 'red' }),
      ).rejects.toThrow(
        new NotFoundException(
          `No car was found with id ${CarFixture.getCarsFixture()._id}.`,
        ),
      );
    });
  });
});
