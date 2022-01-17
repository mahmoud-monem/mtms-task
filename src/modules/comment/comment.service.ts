import { getCustomRepository } from 'typeorm';
import { NotFoundError, ValidationError } from '../../common/errors';
import { CommentRepository } from '../../database/repositories/comment.repository';
import { PostRepository } from '../../database/repositories/post.repository';
import { CreateDto, UpdateDto } from './comment.interface';

export class CommentService {
  postRepository: PostRepository;
  commentRepository: CommentRepository;

  constructor() {
    this.postRepository = getCustomRepository(PostRepository);
    this.commentRepository = getCustomRepository(CommentRepository);
  }

  async create(createDto: CreateDto): Promise<any> {
    const existPost = await this.postRepository.findOne({
      id: createDto.post,
      isDeleted: false,
    });
    if (!existPost) {
      throw new NotFoundError('there is no post with this id');
    }
    const res = await this.commentRepository.insert({
      ...createDto,
      post: existPost,
    });
    return this.commentRepository.findOne(res.identifiers[0].id, {
      relations: ['user'],
    });
  }

  async find(params) {
    const query = { isDeleted: false };
    if (params.userId) {
      query['user'] = params.userId;
    }
    return this.commentRepository.getAll(
      {
        where: query,
        relations: ['user'],
      },
      params,
    );
  }

  async update(id: string, updateDto: UpdateDto, userId: number) {
    const existComment = await this.commentRepository.findOne(id, {
      relations: ['user'],
    });
    if (!existComment) {
      throw new NotFoundError('there is no comment with this id');
    }
    if (existComment.user.id !== userId) {
      throw new ValidationError("you can't edit this comment");
    }
    if (existComment.isDeleted) {
      throw new ValidationError('this comment is deleted', null);
    }
    await this.commentRepository.update(id, updateDto);
    return this.commentRepository.findOne(id, { relations: ['user'] });
  }

  async delete(id: string, userId: number) {
    const existComment = await this.commentRepository.findOne(id, {
      relations: ['user'],
    });
    if (!existComment) {
      throw new NotFoundError('there is no comment with this id');
    }
    if (existComment.user.id !== userId) {
      throw new ValidationError("you can't delete this comment");
    }
    if (existComment.isDeleted) {
      throw new ValidationError('this comment is already deleted', null);
    }
    await this.commentRepository.update(id, { isDeleted: true });
    return { message: 'the comment is deleted successfully' };
  }
}
