import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Roles } from '../../constants/Roles';
import { PreEntity } from '../../core/base.entity';
import { UserProfile } from './profile.entity';

export enum RoleEnum {
  ADMIN,
  AGENT,
  SUPPLIER,
}

@Entity()
export class User extends PreEntity {
  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ unique: true })
  phone: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty({ required: false, default: false })
  @Column({ default: true })
  isActive?: boolean = true;

  @Column({ default: 0 })
  commision: number;

  @ApiProperty()
  @Column({ default: Roles.USER })
  role: number;

  @OneToOne(() => UserProfile)
  @JoinColumn()
  profile: UserProfile;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) this.password = await bcrypt.hash(this.password, 8);
    else this.password = await bcrypt.hash(this.username, 8);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
