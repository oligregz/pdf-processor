import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { RateLimit } from './schemas/rate-limit.schema';
import { RateLimitActionEnum } from 'src/common/enums/rate-limit-action.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectModel(RateLimit.name)
    private readonly rateLimitModel: Model<RateLimit>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string) {
    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      user = this.userRepository.create({
        email,
        passwordHash: 'hashed_password_mock',
      });
      user = await this.userRepository.save(user);
    }

    // A MÁGICA ACONTECE AQUI: O payload agora carrega o email
    const payload = {
      sub: user.id,
      userId: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    const expireAt = new Date();
    expireAt.setMinutes(expireAt.getMinutes() + 15);

    await this.rateLimitModel.create({
      userId: user.id,
      action: RateLimitActionEnum.SESSION_ACTIVE,
      expireAt: expireAt,
    });

    return {
      accessToken,
      expiresAt: expireAt.toISOString(),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
