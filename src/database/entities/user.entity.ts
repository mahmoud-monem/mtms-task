import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Post } from './post.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @Column('varchar', { name: 'email', length: 64 })
  email: string;

  @Column('varchar', { name: 'password', length: 150 })
  password: string;

  @Column('varchar', {
    name: 'image',
    length: 64,
    nullable: true,
  })
  image: string;

  @Column('boolean', { name: 'is_deleted', default: false })
  isDeleted: boolean;

  @Column('enum', {
    name: 'role',
    nullable: true,
    enum: ['user', 'admin'],
  })
  role: 'user' | 'admin' | null;

  @Column('timestamp', {
    name: 'birth_date',
    nullable: true,
  })
  birthDate: Date;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Relations
  // ------------------------------------------------------------------------------

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
