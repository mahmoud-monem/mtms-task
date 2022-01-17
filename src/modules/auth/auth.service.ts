import { getCustomRepository } from 'typeorm';
import { cryptoService } from '../../common/crypto';
import {
  NotFoundError,
  UnauthenticatedError,
  ValidationError,
} from '../../common/errors';
import { UserRepository } from '../../database/repositories';

const SEVEN_DAYS = 7 * 24 * 3600000;

class AuthService {
  userRepository: UserRepository;

  constructor() {
    this.userRepository = getCustomRepository(UserRepository);
  }

  async login(loginDto: any, isFourteen: boolean): Promise<any> {
    const user = await this.userRepository.findOne({
      email: loginDto.username,
    });
    if (!user || !cryptoService.compareHash(loginDto.password, user.password)) {
      throw new NotFoundError('Wrong username or password');
    }
    if (user.isDeleted) {
      throw new UnauthenticatedError('this account is deleted');
    }
    let timeout = SEVEN_DAYS;
    if (isFourteen) {
      timeout += SEVEN_DAYS;
    }
    return this._getUserResponse(user, timeout);
  }

  async register(createDto) {
    const existUser = await this.userRepository.findOne({
      email: createDto.email,
    });

    if (existUser) {
      throw new ValidationError('This email already exist in the database');
    }
    createDto.password = cryptoService.createHash(createDto.password);
    createDto.role = 'user';
    const res = await this.userRepository.insert(createDto);
    const user = await this.userRepository.findOne(res.identifiers[0].id);
    return this._getUserResponse(user);
  }

  async _getUserResponse(user, timeout = SEVEN_DAYS): Promise<any> {
    return cryptoService
      .createJwtTokenWithExpiration(
        {
          sub: user.id.toString(),
        },
        timeout,
      )
      .then((token) => {
        return {
          token,
          user,
        };
      });
  }
}

export default new AuthService();
