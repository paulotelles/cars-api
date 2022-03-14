import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { EXCEPTIONS } from '../constants';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    const validObjectId = Types.ObjectId.isValid(value);

    if (!validObjectId) {
      throw new BadRequestException(EXCEPTIONS.INVALID_OBJECT);
    }
    return value;
  }
}
