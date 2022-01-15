import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import { ValidationError } from './errors';

class CryptoService {
  SALT_ROUNDS = 10;

  createHash(text): string {
    return bcrypt.hashSync(text, bcrypt.genSaltSync(this.SALT_ROUNDS));
  }

  createHmac(crc_token, consumer_secret) {
    return crypto
      .createHmac('sha256', consumer_secret)
      .update(crc_token)
      .digest('base64');
  }

  compareHash(text, hash): boolean {
    return bcrypt.compareSync(text, hash);
  }

  async createJwtToken(data): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(data, config().authentication.key, (err, token) => {
        if (err) {
          return reject(err);
        }
        return resolve(token);
      });
    });
  }

  async createJwtTokenWithExpiration(signObj, timeoutMs = 0) {
    return new Promise((resolve, reject) => {
      const cSignObject = { ...signObj };
      const currentTime = new Date(Date.now()).getTime() / 1000;
      const expireAfter = timeoutMs / 1000;
      cSignObject.exp = currentTime + expireAfter;

      jwt.sign(cSignObject, config().authentication.key, (err, token) => {
        if (err) {
          return reject(err);
        }

        return resolve(token);
      });
    });
  }

  async verifyJwtToken(token): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config().authentication.key, (err, decoded) => {
        if (!err) {
          return resolve(decoded);
        }
        const error = new ValidationError('Invalid authorization token', null);
        return reject(error);
      });
    });
  }

  generateRandomNumber(): number {
    const number = Math.floor(Math.random() * 9000) + 1000;
    return number;
  }
}

export const cryptoService = new CryptoService();
