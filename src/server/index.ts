import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import http from 'http';
import { AddressInfo } from 'net';
import Utils from '../common/utils';
import { middlewares } from './middlewares';

export default class Server {
  options: any;
  app: Application;
  server: http.Server;

  constructor(options: any) {
    this.options = Utils.merge(
      {
        port: process.env.PORT,
      },
      options,
    );

    this.app = this.createExpressInstance();
    this.server = http.createServer(this.app);
  }

  createExpressInstance() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(compression());
    return app;
  }

  applyMiddlewares() {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  async start() {
    const { name, port, onStart, onStarted, onError } = this.options;

    if (onError) {
      this.app.on('error', onError);
    }

    if (onStart) {
      await onStart(this.app);
    }

    this.applyMiddlewares();

    if (onStarted) {
      await onStarted();
    }

    await new Promise<void>((resolve, reject) => {
      this.server.on('error', (err) => {
        if (err.stack !== 'listen') {
          return reject(err);
        }

        switch (err.name) {
          case 'EACCES':
            console.error(`port ${port} requires elevated privileges`);
            process.exit(1);
          case 'EADDRINUSE':
            console.error(`port ${port} is already in use`);
            process.exit(1);
          default:
            if (onError) {
              onError(err);
            }
            reject(err);
        }
        return true;
      });

      this.server.on('listening', () => {
        resolve();
      });

      this.server.listen(port);
    });

    const info = this.server.address();
    const env = process.env.NODE_ENV || 'development';
    const lHost =
      (info as AddressInfo).address === '::'
        ? 'localhost'
        : (info as AddressInfo).address;
    const lPort = (info as AddressInfo).port;

    console.log(`API [${name}] started at [${lHost}:${lPort}] on [${env}]`);
  }

  async stop() {
    const { onEnd } = this.options;
    if (onEnd) {
      await onEnd();
    }

    if (this.server && this.server.listening) {
      this.server.close();
    }
  }
}
