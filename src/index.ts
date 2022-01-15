import dotenv from 'dotenv';
import config from './config';
import Server from './server';
dotenv.config();
const { api } = config();
const instance = new Server({
  name: api.name,
  port: api.port,
  onStart: async () => {
    // await mongo.initialize(mongoDB);
  },
  onStarted: async () => {
    // const events = require('./src/events');
    // events.initialize();
    // const queues = require('./src/queues');
    // queues.initialize();
  },
  onEnd: async () => {
    // await mongo.close();
  },
});

instance.start();
