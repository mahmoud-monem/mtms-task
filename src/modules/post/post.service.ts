import _ from 'lodash';
import { getCustomRepository, Like } from 'typeorm';
import { NotFoundError } from '../../common/errors';
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

  async find(params) {
    const query = [];
    const nQuery = {};
    if (params.userId) {
      nQuery['user'] = params.userId;
    }
    if (params.search) {
      query.push({ text: Like(`%${params.search}%`), ...nQuery });
      query.push({ user: { name: Like(`%${params.search}%`) }, ...nQuery });
      query.push({ user: { email: Like(`%${params.search}%`) }, ...nQuery });
    }
    const posts = await this.postRepository.getAll(
      {
        where: query.length ? query : nQuery,
        relations: ['user'],
      },
      params,
    );
    return this._getPostResponse(posts);
  }

  async findOne(id: string) {
    const post = await this.postRepository.findOne(id, { relations: ['user'] });
    if (!post) {
      throw new NotFoundError('there is no post with this id');
    }
    return this._getPostResponse(post);
  }

  private async _getPostResponse(posts: any) {
    if (!Array.isArray(posts)) {
      posts = [posts];
    }
    posts.forEach((post) => {
      post.user = _.omit(post.user, [
        'password',
        'updatedAt',
        'createdAt',
        'isDeleted',
        'birthDate',
        'role',
      ]);
    });
    return posts.length > 1 ? posts : posts[0];
  }
}

export default new PostService();
