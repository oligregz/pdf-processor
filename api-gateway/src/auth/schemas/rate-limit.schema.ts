import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RateLimitActionEnum } from 'src/common/enums/rate-limit-action.enum';

@Schema({ collection: 'rate_limits' })
export class RateLimit extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ type: String, enum: RateLimitActionEnum, required: true })
  action: RateLimitActionEnum;

  @Prop({
    required: true,
    type: Date,
    expires: 0,
  })
  expireAt: Date;
}

export const RateLimitSchema = SchemaFactory.createForClass(RateLimit);
