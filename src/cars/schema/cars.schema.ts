import { Car } from '../model/cars.model';
import { Helper } from '../../utils/helper';
import { JSONSchemaType } from 'ajv';
import { stringify } from 'querystring';

export const carJsonSchema: JSONSchemaType<Car> = {
  type: 'object',
  required: ['brand', 'color', 'model', 'licensePlate', 'year', 'price'],
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
    price: {
      type: 'number',
      minimum: 0,
    },
  },
  additionalProperties: false,
};

export const updateCarJsonSchema = (): JSONSchemaType<Car> => {
  const props = JSON.parse(JSON.stringify(carJsonSchema.properties));
  const anyOf = Object.keys(props).reduce(
    (initialValue, currentValue): Record<string, Array<string>>[] => {
      const message = { required: [currentValue] };
      initialValue.push(message);
      return initialValue;
    },
    [] as Record<string, Array<string>>[],
  );

  return {
    type: 'object',
    required: [],
    properties: { ...props },
    additionalProperties: false,
    anyOf: anyOf,
  };
};
