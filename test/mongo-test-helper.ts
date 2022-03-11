import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = MongoMemoryServer;

export const rootMongooseTestModule = async (
  options: MongooseModuleOptions = {},
) => {
  const mongo = await mongod.create();
  const uri = mongo.getUri();
  return {
    module: MongooseModule.forRootAsync({
      useFactory: async () => {
        return {
          uri: uri,
          ...options,
        };
      },
    }),
    connection: mongo,
  };
};

export const closeInMongodConnection = async (
  connection: MongoMemoryServer,
) => {
  await connection.stop();
};
