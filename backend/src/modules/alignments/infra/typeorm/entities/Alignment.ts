import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('alignments')
class Alignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer')
  extension: number;

  @Column('varchar')
  type: string;

  @Column('boolean')
  only1: boolean;

  @Column('boolean')
  clearn: boolean;

  @Column('boolean')
  block_pruning: boolean;

  @Column('integer')
  complement: number;

  @Column('integer')
  reverse: number;

  @Column('varchar')
  full_name: string;

  @Column('varchar')
  email: string;

  @Column('boolean')
  ready: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Alignment;
