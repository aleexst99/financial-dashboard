import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }

  @Patch('me')
  async updateProfile(@Req() req, @Body() dto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(req.user.id, dto.name);
    return { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name };
  }

  @Patch('me/password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    await this.usersService.changePassword(req.user.id, dto.currentPassword, dto.newPassword);
    return { message: 'Password updated successfully' };
  }
}