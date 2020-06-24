import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import Alignment from './Alignment';

@Entity('sequences')
class Sequence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  file: string;

  @Column('integer')
  size: number;

  @Column('integer')
  origin: number;

  @Column('varchar')
  alignment_id: string;

  @OneToOne(() => Alignment)
  @JoinColumn({ name: 'alignment_id' })
  provider: Alignment;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Sequence;
