import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

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

  @Prop()
  @ApiProperty({
    description: "Must inform the cars's brand",
    example: 1400.55,
  })
  price: number;
}

export const CarSchema = SchemaFactory.createForClass(Car);
