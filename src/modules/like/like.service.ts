import { getCustomRepository } from 'typeorm';
import { NotFoundError, ValidationError } from '../../common/errors';
import { LikeRepository } from '../../database/repositories/like.repository';
import { PostRepository } from '../../database/repositories/post.repository';
import { CreateDto } from './like.interface';

export class LikeService {
  likeRepository: LikeRepository;
  postRepository: PostRepository;

  constructor() {
    this.likeRepository = getCustomRepository(LikeRepository);
    this.postRepository = getCustomRepository(PostRepository);
  }

  async create(createDto: CreateDto): Promise<any> {
    const existPost = await this.postRepository.findOne({
      id: createDto.post,
      isDeleted: false,
    });
    if (!existPost) {
      throw new NotFoundError('there is no post with this id');
    }
    const existLike = await this.likeRepository.findOne(
      {
        post: { id: Number(createDto.post) },
        user: { id: createDto.user.id },
      },
      { relations: ['user', 'post'] },
    );
    if (existLike) {
      throw new ValidationError('this user has liked this post before');
    }
    const res = await this.likeRepository.insert({
      ...createDto,
      post: existPost,
    });
    return this.likeRepository.findOne(res.identifiers[0].id, {
      relations: ['user'],
    });
  }

  async find(params) {
    const nQuery = {};
    if (params.postId) {
      nQuery['post'] = params.postId;
    }
    return this.likeRepository.getAll(
      {
        where: nQuery,
        relations: ['user'],
      },
      params,
    );
  }

  async delete(id: string, userId: number) {
    const existLike = await this.likeRepository.findOne(id, {
      relations: ['user'],
    });
    if (!existLike) {
      throw new NotFoundError('there is no like with this id');
    }
    if (existLike.user.id !== userId) {
      throw new ValidationError("you can't delete this like");
    }
    await this.likeRepository.delete(id);
    return { message: 'the like is deleted successfully' };
  }
}
