import { EntityRepository } from 'typeorm';
import { Like } from '../entities/like.entity';
import { BaseRepository } from './base.repository';

@EntityRepository(Like)
export class LikeRepository extends BaseRepository<Like> {}
