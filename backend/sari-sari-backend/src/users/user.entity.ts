import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'admin' })
  role: string;

  @Column({ name: 'profile_image', nullable: true, type: 'longtext' })
  profileImage: string | null;
}
