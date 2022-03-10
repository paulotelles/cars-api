import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiSecurity,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AvjValidationPipe } from '../pipes/ajv-validation.pipes';
import { ObjectIdPipe } from '../pipes/mongoId-validation.pipes';
import { CarsService } from './cars.service';
import { Car, CarDocument } from './model/cars.model';
import { carJsonSchema, updateCarJsonSchema } from './schema/cars.schema';

@Controller('cars')
@UseGuards(AuthGuard('api-key'))
@ApiUnauthorizedResponse({
  description: 'When the x-api-key is invalid or was not sent.',
})
@ApiSecurity('x-api-key')
export class CarsController {
  constructor(@Inject(CarsService) private carService: CarsService) {}
  @Post()
  @ApiSecurity('x-api-key')
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
  @ApiParam({
    name: 'id',
    format: 'string',
    example: '6228f2b7b8dcd8e752467c61',
  })
  @HttpCode(HttpStatus.FOUND)
  async findCar(@Param('id', ObjectIdPipe) id: string): Promise<CarDocument> {
    return this.carService.findOne(id);
  }

  @Get()
  @ApiFoundResponse({
    description: 'When a car(s) was(were) found.',
  })
  @HttpCode(HttpStatus.FOUND)
  async findAllCars(): Promise<CarDocument[]> {
    return this.carService.find();
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: 'When a car was sucesfully deleted',
  })
  @ApiParam({
    name: 'id',
    format: 'string',
    example: '6228f2b7b8dcd8e752467c61',
  })
  @HttpCode(HttpStatus.OK)
  async deleteCar(
    @Param('id', ObjectIdPipe) id: string,
  ): Promise<Record<string, string>> {
    return this.carService.delete(id);
  }

  @Put('/:id')
  @ApiOkResponse({
    description: 'When a car was sucesfully deleted',
  })
  @ApiBadRequestResponse({
    description:
      'When the payload is invalid, necessary to inform at least one property to change',
  })
  @ApiParam({
    name: 'id',
    format: 'string',
    example: '6228f2b7b8dcd8e752467c61',
  })
  @ApiBody({ type: Car })
  @HttpCode(HttpStatus.OK)
  async updateCar(
    @Param('id', ObjectIdPipe) id: string,
    @Body(new AvjValidationPipe(updateCarJsonSchema())) body: Partial<Car>,
  ): Promise<CarDocument> {
    return this.carService.update(id, body);
  }
}
