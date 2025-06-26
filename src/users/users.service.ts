import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole, UserStatus } from './user.entity';
import * as bcrypt from 'bcrypt';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      name: dto.email.split('@')[0],
    });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(query: QueryUsersDto) {
    const qb = this.usersRepository.createQueryBuilder('user');
    if (query.role) {
      qb.andWhere('user.role = :role', { role: query.role });
    }
    if (query.status) {
      qb.andWhere('user.status = :status', { status: query.status });
    }
    if (query.search) {
      qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { users: items, pagination: { total, page, totalPages: Math.ceil(total / limit) } };
  }

  async updateStatus(id: number, dto: UpdateStatusDto) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    user.status = dto.status;
    return this.usersRepository.save(user);
  }

  async updateRole(id: number, dto: UpdateRoleDto) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    user.role = dto.role;
    return this.usersRepository.save(user);
  }

  async updateProfile(id: number, dto: UpdateProfileDto) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.avatar !== undefined) user.avatar = dto.avatar;
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
  }
}
