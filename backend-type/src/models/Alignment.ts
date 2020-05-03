import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

import { uuid } from 'uuidv4';

@Entity('alignments')
class Alignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer')
  extension: number;

  @Column('boolean')
  only1: boolean;

  @Column('boolean')
  clearn: boolean;

  @Column('boolean')
  blockPruning: boolean;

  @Column('integer')
  complement: number;

  @Column('integer')
  reverse: number;

  @Column('varchar')
  fullName: string;

  @Column('varchar')
  email: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  addId(): void {
    this.id = uuid();
  }
}

export default Alignment;
