import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car, CarDocument } from './model/cars.model';
import { Model } from 'mongoose';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}
  async create(carSchema: Car): Promise<CarDocument> {
    try {
      const car = this.carModel.create(carSchema);
      if (!car) {
        throw new InternalServerErrorException(
          'Internal Error, try again later.',
        );
      }
      return car;
    } catch (error) {
      throw error;
    }
  }
}
