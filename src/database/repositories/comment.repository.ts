import { EntityRepository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { BaseRepository } from './base.repository';

@EntityRepository(Comment)
export class CommentRepository extends BaseRepository<Comment> {}
