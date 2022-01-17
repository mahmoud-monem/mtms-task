import { User } from '../../database/entities/user.entity';

export interface CreateDto {
  user: User;
  post: number;
}
