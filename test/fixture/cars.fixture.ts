import { CarDocument } from '../../src/cars/model/cars.model';

export class CarFixture {
  static getCarsFixture(): CarDocument {
    return {
      _id: '4ds65f165sd1f65ds1536',
      brand: 'BMW',
      model: 'BMW X5',
      color: 'blue',
      year: 2020,
      licensePlate: 'BD34DS56',
      price: 22000,
    } as CarDocument;
  }
  static getRequestCarsFixture() {
    return {
      brand: 'BMW',
      model: 'BMW X5',
      color: 'blue',
      year: 2020,
      licensePlate: 'BD34DS56',
      price: 22000,
    };
  }
}
