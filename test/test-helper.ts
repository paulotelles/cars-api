import { CarsService } from '../src/cars/cars.service';

export type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};

export const carsServiceMockFactory: () => MockType<CarsService> = jest.fn(
  () => ({
    create: jest.fn((value) => value),
  }),
);
