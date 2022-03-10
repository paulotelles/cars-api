import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CarsModule,
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
