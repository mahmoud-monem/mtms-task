import { getCustomRepository, Like } from 'typeorm';
import { NotFoundError, ValidationError } from '../../common/errors';
import { UserRepository } from '../../database/repositories';
import { UpdateDto } from './user.interface';

export class UserService {
  userRepository: UserRepository;

  constructor() {
    this.userRepository = getCustomRepository(UserRepository);
  }

  async find(params) {
    const query = [];
    const nQuery = { isDeleted: false };
    if (params.search) {
      query.push({ name: Like(`%${params.search}%`), ...nQuery });
      query.push({ email: Like(`%${params.search}%`), ...nQuery });
    }
    return this.userRepository.getAll(
      {
        where: query.length ? query : nQuery,
      },
      params,
    );
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundError('there is no user with this id');
    }
    if (user.isDeleted) {
      throw new ValidationError('this user is deleted', null);
    }
    return user;
  }

  async update(id: string, updateDto: UpdateDto) {
    const existUser = await this.userRepository.findOne(id);
    if (!existUser) {
      throw new NotFoundError('there is no user with this id');
    }
    if (existUser.isDeleted) {
      throw new ValidationError('this user is deleted', null);
    }
    await this.userRepository.update(id, updateDto);
    return this.userRepository.findOne(id);
  }

  async delete(id: string) {
    const existUser = await this.userRepository.findOne(id);
    if (!existUser) {
      throw new NotFoundError('there is no user with this id');
    }
    if (existUser.isDeleted) {
      throw new ValidationError('this user is already deleted', null);
    }
    await this.userRepository.update(id, { isDeleted: true });
    return { message: 'the user is deleted successfully' };
  }
}

export default new UserService();
