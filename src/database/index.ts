import { Connection, createConnection, getConnection } from 'typeorm';
import ORMConfig from '../config/ormconfig';

export const DBConnect = async () => {
  let connection: Connection | undefined;
  try {
    connection = getConnection();
  } catch (e) {}

  try {
    if (connection) {
      if (!connection.isConnected) {
        console.log(connection);

        await connection.connect();
      }
    } else {
      await createConnection(ORMConfig());
    }
    console.log('🌴 Database connection was successful!');
  } catch (e) {
    console.error('ERROR: Database connection failed!!', e);
    throw e;
  }
};

export const TryDBConnect = async (onError: any, next?: any) => {
  try {
    await DBConnect();
    if (next) {
      next();
    }
  } catch (e) {
    onError();
    setTimeout(async () => {
      return TryDBConnect(onError, next);
    }, 2000);
  }
};
