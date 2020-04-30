import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { uuid } from 'uuidv4';

import Alignment from './Alignment';

@Entity('sequences')
export default class Sequence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  file: string;

  @Column('integer')
  size: number;

  @Column('integer')
  origin: number;

  @Column('varchar')
  edge: string;

  @Column('varchar')
  alignment_id: string;

  @OneToOne(() => Alignment)
  @JoinColumn({ name: 'alignment_id' })
  provider: Alignment;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  addId(): void {
    this.id = uuid();
  }
}
