import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(email: string, password: string, name: string): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async setRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    const hashedRefreshToken = refreshToken
      ? await bcrypt.hash(this.preHash(refreshToken), 10)
      : null;

    await this.usersRepository.update(userId, { hashedRefreshToken });
  }

  async validateRefreshToken(refreshToken: string, storedHash: string): Promise<boolean> {
    return bcrypt.compare(this.preHash(refreshToken), storedHash);
  }

  private preHash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }
}