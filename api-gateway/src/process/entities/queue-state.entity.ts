import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { ProcessHistory } from './process-history.entity';

@Entity('queue_state')
export class QueueState {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ProcessHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'process_id' })
  process: ProcessHistory;

  @Column()
  status: string;

  @Column({ name: 'position_in_queue', type: 'int', nullable: true })
  positionInQueue: number;

  @CreateDateColumn({ name: 'entered_at', type: 'timestamp with time zone' })
  enteredAt: Date;
}
