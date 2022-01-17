import _ from 'lodash';
import { getCustomRepository, Like } from 'typeorm';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../common/errors';
import { PostRepository } from '../../database/repositories/post.repository';
import { CreateDto, UpdateDto } from './user-post.interface';

class UserPostService {
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
    const nQuery = { isDeleted: false };
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

  async findOne(id: string, userId: string) {
    const post = await this.postRepository.findOne(id, { relations: ['user'] });
    if (!post) {
      throw new NotFoundError('there is no post with this id');
    }
    if (post.user.id.toString() !== userId) {
      throw new NotFoundError('there is no post with this id for this user');
    }
    if (post.isDeleted) {
      throw new ValidationError('this post is deleted', null);
    }
    return this._getPostResponse(post);
  }

  async update(id: string, updateDto: UpdateDto, userId: string) {
    const existPost = await this.postRepository.findOne(id, {
      relations: ['user'],
    });
    if (!existPost) {
      throw new NotFoundError('there is no post with this id');
    }
    if (existPost.user.id.toString() !== userId) {
      throw new UnauthorizedError("You can't update this post");
    }
    if (existPost.isDeleted) {
      throw new ValidationError('this post is deleted', null);
    }
    await this.postRepository.update(id, updateDto);
    const post = await this.postRepository.findOne(id, { relations: ['user'] });
    return this._getPostResponse(post);
  }

  async delete(id: string, userId: string) {
    const existPost = await this.postRepository.findOne(id, {
      relations: ['user'],
    });
    if (!existPost) {
      throw new NotFoundError('there is no post with this id');
    }
    if (existPost.user.id.toString() !== userId) {
      throw new UnauthorizedError("You can't delete this post");
    }
    if (existPost.isDeleted) {
      throw new ValidationError('this post is already deleted', null);
    }
    await this.postRepository.update(id, { isDeleted: true });
    return { message: 'the post is deleted successfully' };
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

export default new UserPostService();
