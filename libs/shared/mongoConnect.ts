import * as mongoose from 'mongoose';

export default async function connectToMongo(
  connectionString: string = process.env.MongoConnectionString,
  autoIndex: boolean = JSON.parse(process.env.MongoAutoIndex)
) {
  if (!mongoose.connection || !mongoose.connection.readyState) {
    await mongoose.connect(connectionString, {
      autoIndex,
      useNewUrlParser: true
    });
  }

  return mongoose.connection;
}
