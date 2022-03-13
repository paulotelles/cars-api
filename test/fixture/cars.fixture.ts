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
  static getRequestCarsFixtureV2() {
    return {
      brand: 'Audi',
      model: 'Audi TT',
      color: 'white',
      year: 2008,
      licensePlate: 'G9NKRWF8',
      price: 10000,
    };
  }
  static getBadRequestCarsFixture() {
    return {
      brand: 'BMW',
      model: 'BMW X5',
      color: 'blue',
      year: 2020,
      licensePlate: 'BD34DS56',
    };
  }
  static getAllCarsFixture(): CarDocument[] {
    return [
      {
        _id: '4ds65f165sd1f65ds1536',
        brand: 'BMW',
        model: 'BMW X5',
        color: 'blue',
        year: 2020,
        licensePlate: 'BD34DS56',
        price: 22000,
      },
      {
        _id: '6228ebb75522f9dd0f69ef7c',
        brand: 'Audi',
        model: 'Audi TT',
        color: 'red',
        year: 2019,
        licensePlate: 'RS34DS56',
        price: 17000,
      },
    ] as CarDocument[];
  }
}
