import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'error_logs', timestamps: true })
export class ErrorLog extends Document {
  @Prop({ required: true, index: true })
  correlationId: string;

  @Prop({ required: true })
  service: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object })
  stackTrace: Record<string, any>;
}

export const ErrorLogSchema = SchemaFactory.createForClass(ErrorLog);
