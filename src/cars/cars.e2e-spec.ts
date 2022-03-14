import * as request from 'supertest';

import { Car, CarDocument, CarSchema } from './model/cars.model';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Model, connection, disconnect, mongo } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/mongo-test-helper';

import { AuthModule } from '../auth/auth.module';
import { CarFixture } from '../../test/fixture/cars.fixture';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

let HEADERS;

jest.setTimeout(10000);

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
    await myModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection((await testMongo).connection);
    disconnect();
    connection.close();
  });

  describe('Shoud test (POST) in /cars route', () => {
    it('Should create a car on POST', async () => {
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
    it('Should return Unauthorized', async () => {
      const carRequest = CarFixture.getRequestCarsFixture();
      const invalidHeader = { 'X-API-KEY': 'abc' };
      return request(app.getHttpServer())
        .post('/cars')
        .set(invalidHeader)
        .send(carRequest)
        .expect(HttpStatus.UNAUTHORIZED)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const result = {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Unauthorized',
          };
          expect(result).toStrictEqual(body);
        });
    });
    it('Should return BadRequest', async () => {
      const carRequest = CarFixture.getBadRequestCarsFixture();
      return request(app.getHttpServer())
        .post('/cars')
        .set(HEADERS)
        .send(carRequest)
        .expect(HttpStatus.BAD_REQUEST)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const result = {
            statusCode: HttpStatus.BAD_REQUEST,
            message: [{ message: "must have required property 'price'" }],
            error: 'Bad Request',
          };
          expect(result).toStrictEqual(body);
        });
    });
  });
  describe('Shoud test (GET) in /cars/:id route', () => {
    it('Should return a car on GET with ID', async () => {
      const car = await myModel.create(CarFixture.getRequestCarsFixture());
      const getParam = `/cars/${car._id}`;
      return request(app.getHttpServer())
        .get(getParam)
        .set(HEADERS)
        .expect(HttpStatus.FOUND)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const result = CarFixture.getRequestCarsFixture();

          expect(result?.brand).toStrictEqual(body.brand);
          expect(result?.color).toStrictEqual(body.color);
          expect(result?.model).toStrictEqual(body.model);
          expect(result?.licensePlate).toStrictEqual(body.licensePlate);
          expect(result?.year).toStrictEqual(body.year);
          expect(result?.price).toStrictEqual(body.price);
        });
    });
    it('Should return Unauthorized', async () => {
      const car = await myModel.create(CarFixture.getRequestCarsFixture());
      const getParam = `/cars/${car._id}`;
      const invalidHeader = { 'X-API-KEY': 'abc' };
      return request(app.getHttpServer())
        .get(getParam)
        .set(invalidHeader)
        .expect(HttpStatus.UNAUTHORIZED)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const result = {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Unauthorized',
          };
          expect(result).toStrictEqual(body);
        });
    });
    it('Should return BadRequest', async () => {
      const invalidMongoId = 'abcde3';
      const getParam = `/cars/${invalidMongoId}`;
      return request(app.getHttpServer())
        .get(getParam)
        .set(HEADERS)
        .expect(HttpStatus.BAD_REQUEST)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const result = {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid ObjectId',
            error: 'Bad Request',
          };
          expect(result).toStrictEqual(body);
        });
    });
    it('Should return NotFound', async () => {
      const validMongoId = new mongo.ObjectId();
      const getParam = `/cars/${validMongoId}`;
      return request(app.getHttpServer())
        .get(getParam)
        .set(HEADERS)
        .expect(HttpStatus.NOT_FOUND)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const result = {
            statusCode: HttpStatus.NOT_FOUND,
            message: `No car was found with id ${validMongoId}.`,
            error: 'Not Found',
          };
          expect(result).toStrictEqual(body);
        });
    });
  });
  describe('Shoud test (GET) in /cars route', () => {
    it('Should return an array of cars on GET', async () => {
      return request(app.getHttpServer())
        .get('/cars')
        .set(HEADERS)
        .expect(HttpStatus.FOUND)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          expect(body).toHaveLength(2);
        });
    });
    it('Should return Unauthorized', async () => {
      const invalidHeader = { 'X-API-KEY': 'abc' };
      return request(app.getHttpServer())
        .get('/cars')
        .set(invalidHeader)
        .expect(HttpStatus.UNAUTHORIZED)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const result = {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Unauthorized',
          };
          expect(result).toStrictEqual(body);
        });
    });
    it('Should return NotFound', async () => {
      return request(app.getHttpServer())
        .get('/cars')
        .set(HEADERS)
        .expect(HttpStatus.NOT_FOUND)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const result = {
            statusCode: HttpStatus.NOT_FOUND,
            message: `No car was found.`,
            error: 'Not Found',
          };
          expect(result).toStrictEqual(body);
        });
    });
  });
  describe('Shoud test (DELETE) in /cars/:id route', () => {
    it('Should delete a car on DELETE with ID', async () => {
      const car = await myModel.create(CarFixture.getRequestCarsFixture());
      const getParam = `/cars/${car._id}`;
      return request(app.getHttpServer())
        .delete(getParam)
        .set(HEADERS)
        .expect(HttpStatus.OK)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const result = await myModel.findById(car._id);
          const response = {
            message: `Sucessfully deleted car with id ${car._id}`,
          };
          expect(response).toStrictEqual(body);
          expect(result).toStrictEqual(null);
        });
    });
    it('Should return Unauthorized', async () => {
      const car = await myModel.create(CarFixture.getRequestCarsFixture());
      const getParam = `/cars/${car._id}`;
      const invalidHeader = { 'X-API-KEY': 'abc' };
      return request(app.getHttpServer())
        .delete(getParam)
        .set(invalidHeader)
        .expect(HttpStatus.UNAUTHORIZED)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const result = {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Unauthorized',
          };
          expect(result).toStrictEqual(body);
        });
    });
    it('Should return BadRequest', async () => {
      const invalidMongoId = 'abcde3';
      const getParam = `/cars/${invalidMongoId}`;
      return request(app.getHttpServer())
        .delete(getParam)
        .set(HEADERS)
        .expect(HttpStatus.BAD_REQUEST)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const result = {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid ObjectId',
            error: 'Bad Request',
          };
          expect(result).toStrictEqual(body);
        });
    });
    it('Should return NotFound', async () => {
      const validMongoId = new mongo.ObjectId();
      const getParam = `/cars/${validMongoId}`;
      return request(app.getHttpServer())
        .delete(getParam)
        .set(HEADERS)
        .expect(HttpStatus.NOT_FOUND)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const result = {
            statusCode: HttpStatus.NOT_FOUND,
            message: `No car was found with id ${validMongoId}.`,
            error: 'Not Found',
          };
          expect(result).toStrictEqual(body);
        });
    });
  });
  describe('Shoud test (PUT) in /cars/:id route', () => {
    it('Should update a car on PUT with ID', async () => {
      const car = await myModel.create(CarFixture.getRequestCarsFixture());
      const getParam = `/cars/${car._id}`;
      const payload = CarFixture.getRequestCarsFixtureV2();
      return request(app.getHttpServer())
        .put(getParam)
        .set(HEADERS)
        .send(payload)
        .expect(HttpStatus.OK)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const response = {
            _id: car._id.toString(),
            price: payload.price,
            year: payload.year,
            licensePlate: payload.licensePlate,
            model: payload.model,
            color: payload.color,
            brand: payload.brand,
            __v: 0,
          };
          expect(response).toStrictEqual(body);
        });
    });
    it('Should return Unauthorized', async () => {
      const car = await myModel.create(CarFixture.getRequestCarsFixture());
      const getParam = `/cars/${car._id}`;
      const payload = CarFixture.getRequestCarsFixtureV2();
      const invalidHeader = { 'X-API-KEY': 'abc' };
      return request(app.getHttpServer())
        .put(getParam)
        .set(invalidHeader)
        .send(payload)
        .expect(HttpStatus.UNAUTHORIZED)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const result = {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Unauthorized',
          };
          expect(result).toStrictEqual(body);
        });
    });
    it('Should return BadRequest', async () => {
      const payload = CarFixture.getRequestCarsFixtureV2();
      const invalidMongoId = 'abcde3';
      const getParam = `/cars/${invalidMongoId}`;
      return request(app.getHttpServer())
        .put(getParam)
        .set(HEADERS)
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const result = {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid ObjectId',
            error: 'Bad Request',
          };
          expect(result).toStrictEqual(body);
        });
    });
    it('Should return NotFound', async () => {
      const payload = CarFixture.getRequestCarsFixtureV2();
      const validMongoId = new mongo.ObjectId();
      const getParam = `/cars/${validMongoId}`;
      return request(app.getHttpServer())
        .put(getParam)
        .set(HEADERS)
        .send(payload)
        .expect(HttpStatus.NOT_FOUND)
        .then(async ({ body }) => {
          expect(body).toBeDefined();
          const result = {
            statusCode: HttpStatus.NOT_FOUND,
            message: `No car was found with id ${validMongoId}.`,
            error: 'Not Found',
          };
          expect(result).toStrictEqual(body);
        });
    });
  });
});
