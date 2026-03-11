import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';

import { User } from '../../auth/entities/user.entity';
import { ProcessStatusEnum } from 'src/common/enums/process-status.enum';

@Entity('process_history')
export class ProcessHistory {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'correlation_id', unique: true })
  correlationId: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({
    type: 'enum',
    enum: ProcessStatusEnum,
    default: ProcessStatusEnum.PENDING,
  })
  status: ProcessStatusEnum;

  @Column({
    name: 'processing_start',
    type: 'timestamp with time zone',
    nullable: true,
  })
  processingStart: Date;

  @Column({
    name: 'processing_end',
    type: 'timestamp with time zone',
    nullable: true,
  })
  processingEnd: Date;

  @Column({
    name: 'txt_conversion_start',
    type: 'timestamp with time zone',
    nullable: true,
  })
  txtConversionStart: Date;

  @Column({
    name: 'txt_conversion_end',
    type: 'timestamp with time zone',
    nullable: true,
  })
  txtConversionEnd: Date;

  @Column({
    name: 'email_sent_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  emailSentAt: Date;

  @Column({
    name: 'file_deletion_time',
    type: 'timestamp with time zone',
    nullable: true,
  })
  fileDeletionTime: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}