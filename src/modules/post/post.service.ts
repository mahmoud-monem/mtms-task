import _ from 'lodash';
import { getCustomRepository } from 'typeorm';
import { PostRepository } from '../../database/repositories/post.repository';
import { CreateDto } from './post.interface';

class PostService {
  postRepository: PostRepository;

  constructor() {
    this.postRepository = getCustomRepository(PostRepository);
  }

  async create(createDto: CreateDto): Promise<any> {
    const res = await this.postRepository.insert(createDto);
    const post = await this.postRepository.findOne(res.identifiers[0].id, {
      relations: ['user'],
    });
    return this._getPostResponse(post);
  }

  private async _getPostResponse(post: any) {
    post.user = _.omit(post.user, [
      'password',
      'updatedAt',
      'createdAt',
      'isDeleted',
      'birthDate',
      'role',
    ]);
    return post;
  }
}

export default new PostService();
