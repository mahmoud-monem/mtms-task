import { User } from '../../database/entities/user.entity';

export interface CreateDto {
  text: string;
  user: User;
}

export interface UpdateDto {
  text: string;
}
