import { Injectable } from '@nestjs/common';

@Injectable()
export class CarsService {
  constructor() {}
  async helloWorld() {
    return 'hello world';
  }
}
