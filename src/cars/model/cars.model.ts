import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Helper } from '../../utils/helper';
import { JSONSchemaType } from 'ajv';

export type CarDocument = Car & Document;

@Schema()
export class Car {
  @Prop()
  @ApiProperty({ description: "Must inform the cars's brand", example: 'BMW' })
  brand: string;

  @Prop()
  @ApiProperty({ description: "Must inform the cars's brand", example: 'BMW' })
  color: string;

  @Prop()
  @ApiProperty({ description: "Must inform the cars's model", example: 'BMW' })
  model: string;

  @Prop()
  @ApiProperty({
    description: "Must inform the cars's license plate",
    example: 'BWS59D8Z',
  })
  licensePlate: string;

  @Prop()
  @ApiProperty({ description: "Must inform the cars's brand", example: 1999 })
  year: number;
}

export const CarJsonSchema: JSONSchemaType<Car> = {
  type: 'object',
  required: ['brand', 'color', 'model', 'licensePlate', 'year'],
  properties: {
    brand: {
      type: 'string',
      minLength: 3,
      maxLength: 60,
    },
    color: {
      type: 'string',
      minLength: 3,
      maxLength: 60,
    },
    model: {
      type: 'string',
      minLength: 3,
      maxLength: 60,
    },
    licensePlate: {
      type: 'string',
      minLength: 8,
      maxLength: 8,
    },
    year: {
      type: 'number',
      minimum: 1900,
      maximum: Helper.getYear(),
    },
  },
  additionalProperties: false,
};

export const CarSchema = SchemaFactory.createForClass(Car);
