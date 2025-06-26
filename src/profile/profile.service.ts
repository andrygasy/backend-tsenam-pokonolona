import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getProfile(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) return null;
    const { id, name, email, isProfessional, professionalType, avatar, phone } = user;
    return { id, name, email, isProfessional, professionalType, avatar, phone };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.avatar !== undefined) user.avatar = dto.avatar;
    await this.usersRepository.save(user);
    const { id, name, email, isProfessional, professionalType, avatar, phone } = user;
    return { id, name, email, isProfessional, professionalType, avatar, phone };
  }
}
