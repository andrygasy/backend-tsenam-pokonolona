import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getProfile(@Req() req: Request) {
    const user = await this.usersService.findById(req.user['id']);
    if (!user) return null;
    const { id, name, email, isProfessional, professionalType, avatar, phone } = user;
    return { id, name, email, isProfessional, professionalType, avatar, phone };
  }

  @Put()
  updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user['id'], dto);
  }
}
