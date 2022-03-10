import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
  async find(): Promise<CarDocument[]> {
    try {
      const car = await this.carModel.find();
      if (!car || car.length === 0) {
        throw new NotFoundException(`No car was found.`);
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
        throw new NotFoundException(`No car was found with id ${id}.`);
      }
      return { message: `Sucessfully deleted car with id ${id}` };
    } catch (error) {
      throw error;
    }
  }
  async update(id: string, body: Partial<Car>): Promise<CarDocument> {
    try {
      const car = await this.carModel.findOneAndUpdate({ _id: id }, body, {
        returnOriginal: false
      });
      if (!car) {
        throw new NotFoundException(`No car was found with id ${id}.`);
      }
      return car;
    } catch (error) {
      throw error;
    }
  }
}
