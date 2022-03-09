import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AvjValidationPipe } from '../pipes/ajv-validation.pipes';
import { CarsService } from './cars.service';
import { Car, CarDocument } from './model/cars.model';
import { carJsonSchema } from './schema/cars.schema';

@Controller('cars')
export class CarsController {
  constructor(@Inject(CarsService) private carService: CarsService) {}
  @Post()
  @UsePipes(new AvjValidationPipe(carJsonSchema))
  @HttpCode(HttpStatus.CREATED)
  async createCar(@Body() body: Car): Promise<CarDocument> {
    return this.carService.create(body);
  }
}
