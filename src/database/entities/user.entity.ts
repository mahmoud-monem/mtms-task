import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('email', ['email'], {})
@Entity({ name: 'users' })
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

  @Column('enum', {
    name: 'role',
    nullable: true,
    enum: ['user', 'admin'],
  })
  role: 'user' | 'admin' | null;

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
}
