import Ajv, { Schema } from 'ajv';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { Helper } from '../utils/helper';

@Injectable()
export class AvjValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(this.schema);
    const valid = validate(value);
    if (!valid) {
      const message = validate.errors?.map((error) => {
        return {
          field: error.instancePath
            ? error.instancePath.substring(1)
            : error.params.additionalProperty,
          message: error.message,
        };
      });
      throw new BadRequestException(message);
    }
    return value;
  }
}
