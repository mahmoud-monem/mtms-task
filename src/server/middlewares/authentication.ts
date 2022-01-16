import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { cryptoService } from '../../common/crypto';
import { UnauthenticatedError } from '../../common/errors';
import { UserRepository } from '../../database/repositories';
import { AuthAccount } from '../../interfaces/AuthAccount.interface';

const userRepository = getCustomRepository(UserRepository);
export async function authentication(req: Request, res: Response, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    req['account'] = publicAccount();
    return next();
  }
  const jwtPayload = await cryptoService.verifyJwtToken(authorization);
  if (jwtPayload) {
    const { sub } = jwtPayload;
    req['account'] = await findAndValidateAccount(sub);
    return next();
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
    return user;
  } catch (err) {
    throw new UnauthenticatedError('Invalid Account');
  }
}
