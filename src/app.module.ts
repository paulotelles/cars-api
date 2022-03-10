import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CarsModule,
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    AuthModule,
    TerminusModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
