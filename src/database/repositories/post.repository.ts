import { EntityRepository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { BaseRepository } from './base.repository';

@EntityRepository(Post)
export class PostRepository extends BaseRepository<Post> {}
