import * as request from 'supertest';

import { Car, CarDocument, CarSchema } from './model/cars.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Model, connection, disconnect } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/mongo-test-helper';

import { AuthModule } from '../auth/auth.module';
import { CarFixture } from '../../test/fixture/cars.fixture';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { MongooseModule } from '@nestjs/mongoose';

let HEADERS;

const envVariablesToUse = {
  'API-KEY': 'abcde832',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let service: CarsService;
  let myModel: Model<CarDocument>;

  const testMongo = rootMongooseTestModule();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        (await testMongo).module,
        MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
        AuthModule,
        ConfigModule.forRoot(),
      ],
      controllers: [CarsController],
      providers: [CarsService],
    })
      .overrideProvider(CarsService)
      .useValue(service)
      .compile();

    HEADERS = { 'X-API-KEY': process.env.API_KEY };
    myModel = moduleFixture.get<Model<CarDocument>>('CarModel');
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await closeInMongodConnection((await testMongo).connection);
    disconnect();
    connection.close();
  });

  it('/ (GET)', () => {
    const carRequest = CarFixture.getRequestCarsFixture();
    const car = CarFixture.getCarsFixture();
    return request(app.getHttpServer())
      .post('/cars')
      .set(HEADERS)
      .send(carRequest)
      .expect(HttpStatus.CREATED)
      .then(async ({ body }) => {
        expect(body).toBeDefined();
        const result = await myModel.findById(body._id).exec();

        expect(result?.brand).toStrictEqual(car.brand);
        expect(result?.color).toStrictEqual(car.color);
        expect(result?.model).toStrictEqual(car.model);
        expect(result?.licensePlate).toStrictEqual(car.licensePlate);
        expect(result?.year).toStrictEqual(car.year);
        expect(result?.price).toStrictEqual(car.price);
      });
  });
});
