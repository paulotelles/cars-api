import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MockType, carsServiceMockFactory } from '../../test/test-helper';
import { Test, TestingModule } from '@nestjs/testing';

import { CarDocument } from './model/cars.model';
import { CarFixture } from '../../test/fixture/cars.fixture';
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

  it('Shoud sucessfully create a car', async () => {
    jest
      .spyOn(service, 'create')
      .mockReturnValueOnce(CarFixture.getCarsFixture());
    const newCar = await controller.createCar(
      CarFixture.getRequestCarsFixture(),
    );
    expect(newCar).toEqual(CarFixture.getCarsFixture());
  });

  it('Shoud sucessfully update a car', async () => {
    const originalCar = CarFixture.getCarsFixture();
    const updatedCar: CarDocument = JSON.parse(JSON.stringify(originalCar));
    updatedCar.color = 'red';
    jest.spyOn(service, 'update').mockReturnValueOnce(updatedCar);
    const newCar = await controller.updateCar(CarFixture.getCarsFixture()._id, {
      color: 'red',
    });
    expect(newCar).toEqual(updatedCar);
  });

  it('Shoud sucessfully find a car', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockReturnValueOnce(CarFixture.getCarsFixture());
    const newCar = await controller.findCar(CarFixture.getCarsFixture()._id);
    expect(newCar).toEqual(CarFixture.getCarsFixture());
  });

  it('Shoud sucessfully find all cars', async () => {
    jest
      .spyOn(service, 'find')
      .mockReturnValueOnce(CarFixture.getAllCarsFixture());
    const newCar = await controller.findAllCars();
    expect(newCar).toEqual(CarFixture.getAllCarsFixture());
  });
});
