import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { cryptoService } from '../../common/crypto';
import { UnauthenticatedError } from '../../common/errors';
import { UserRepository } from '../../database/repositories';
import { AuthAccount } from '../../interfaces/AuthAccount.interface';

const userRepository = getCustomRepository(UserRepository);
export async function authentication(req: Request, res: Response, next) {
  let authorization = req.headers.authorization;
  if (!authorization) {
    req['account'] = publicAccount();
    return next();
  }
  if (authorization.startsWith('Bearer')) {
    authorization = authorization.split(' ')[1];
  }
  try {
    const jwtPayload = await cryptoService.verifyJwtToken(authorization);
    if (jwtPayload) {
      const { sub } = jwtPayload;
      req['account'] = await findAndValidateAccount(sub);
      return next();
    }
  } catch (err) {
    next(err);
  }
  throw new UnauthenticatedError('Invalid Account');
}

function publicAccount(): AuthAccount {
  return {
    id: null,
    role: 'public',
  } as AuthAccount;
}

async function findAndValidateAccount(id: string): Promise<AuthAccount> {
  try {
    const user = await userRepository.findOne(id);
    if (user.isDeleted) {
      throw new UnauthenticatedError('this account is deleted');
    }
    return user;
  } catch (err) {
    throw err;
  }
}
