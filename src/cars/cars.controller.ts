import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Car } from './model/cars.model';

@Controller('cars')
export class CarsController {
  constructor() {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCar(@Body() body: Car) {
    return 'test';
  }
}
