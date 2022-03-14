import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car, CarDocument } from './model/cars.model';
import { Model } from 'mongoose';
import { EXCEPTIONS, SUCESSFULL_DELETE } from '../constants';
import { Helper } from '../utils/helper';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}
  async create(carSchema: Car): Promise<CarDocument> {
    try {
      const car = this.carModel.create(carSchema);
      if (!car) {
        throw new InternalServerErrorException(EXCEPTIONS.INTERNAL_ERROR);
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
        throw new NotFoundException(
          Helper.formatString(EXCEPTIONS.NOT_FOUND_ID, id),
        );
      }
      return car as CarDocument;
    } catch (error) {
      throw error;
    }
  }
  async find(): Promise<CarDocument[]> {
    try {
      const car = await this.carModel.find();
      if (!car || car.length === 0) {
        throw new NotFoundException(EXCEPTIONS.NOT_FOUND);
      }
      return car as CarDocument[];
    } catch (error) {
      throw error;
    }
  }
  async delete(id: string): Promise<Record<string, string>> {
    try {
      const car = await this.carModel.findOneAndRemove({ _id: id });
      if (!car) {
        throw new NotFoundException(
          Helper.formatString(EXCEPTIONS.NOT_FOUND_ID, id),
        );
      }
      return { message: Helper.formatString(SUCESSFULL_DELETE.MESSAGE, id) };
    } catch (error) {
      throw error;
    }
  }
  async update(id: string, body: Partial<Car>): Promise<CarDocument> {
    try {
      const car = await this.carModel.findOneAndUpdate({ _id: id }, body, {
        returnOriginal: false,
      });
      if (!car) {
        throw new NotFoundException(
          Helper.formatString(EXCEPTIONS.NOT_FOUND_ID, id),
        );
      }
      return car;
    } catch (error) {
      throw error;
    }
  }
}
