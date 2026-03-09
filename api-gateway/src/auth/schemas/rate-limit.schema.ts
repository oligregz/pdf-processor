import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'rate_limits' })
export class RateLimit extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true, type: Date, expires: 0 })
  expireAt: Date;
}

export const RateLimitSchema = SchemaFactory.createForClass(RateLimit);