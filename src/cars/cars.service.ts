import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car, CarDocument } from './model/cars.model';
import { Model, Types } from 'mongoose';

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
  async findOne(id: string): Promise<CarDocument> {
    try {
      const car = await this.carModel.findById(id);
      if (!car) {
        throw new NotFoundException(`No car was found with id ${id}.`);
      }
      return car as CarDocument;
    } catch (error) {
      throw error;
    }
  }
}
