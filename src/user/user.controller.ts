import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UserProperties, UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body('name') name: string) {
    if (!name || name.trim() === '') {
      throw new BadRequestException('Name is required');
    }
    return this.userService.createUser(name);
  }

  @Post('follow')
  follow(@Body() body: { follower: string; followee: string }) {
    if (!body.follower || !body.followee) {
      throw new BadRequestException('Both follower and followee are required');
    }
    return this.userService.followUser(body.follower, body.followee);
  }

  @Get('followers')
  getFollowers(@Query('name') name: string): Promise<UserProperties[]> {
    if (!name || name.trim() === '') {
      throw new BadRequestException('Name parameter is required');
    }
    return this.userService.getFollowers(name.trim());
  }

  @Get('following')
  getFollowing(@Query('name') name: string): Promise<UserProperties[]> {
    if (!name || name.trim() === '') {
      throw new BadRequestException('Name parameter is required');
    }
    return this.userService.getFollowing(name.trim());
  }
}
