import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiFoundResponse,
} from '@nestjs/swagger';
import { AvjValidationPipe } from '../pipes/ajv-validation.pipes';
import { ObjectIdPipe } from '../pipes/mongoId-validation.pipes';
import { CarsService } from './cars.service';
import { Car, CarDocument } from './model/cars.model';
import { carJsonSchema } from './schema/cars.schema';

@Controller('cars')
export class CarsController {
  constructor(@Inject(CarsService) private carService: CarsService) {}
  @Post()
  @UsePipes(new AvjValidationPipe(carJsonSchema))
  @ApiCreatedResponse({ description: 'When a new Car is created' })
  @ApiBadRequestResponse({ description: 'When the payload is invalid ' })
  @HttpCode(HttpStatus.CREATED)
  async createCar(@Body() body: Car): Promise<CarDocument> {
    return this.carService.create(body);
  }

  @Get('/:id')
  @ApiFoundResponse({
    description: 'When a car was found with the provided id.',
  })
  @HttpCode(HttpStatus.FOUND)
  async findCar(@Param('id', ObjectIdPipe) id: string): Promise<CarDocument> {
    return this.carService.findOne(id);
  }
}
