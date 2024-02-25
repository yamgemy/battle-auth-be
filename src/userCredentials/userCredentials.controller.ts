import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCredentials } from './schemas/userCredentials.schema';
import { UserCredentialsService } from './userCredentials.services';

@Controller('cred')
export class UserCrendtialsController {
  constructor(private userCredentialsService: UserCredentialsService) {}

  @UseGuards(AuthGuard) //only affects incoming requests, not the delegated service
  @Get()
  async listAll(): Promise<UserCredentials[]> {
    const result = await this.userCredentialsService.getAllUsersCreds();
    return result;
  }

  @UseGuards(AuthGuard) //only affects incoming requests, not the delegated service
  @Patch(':id')
  update(
    @Param('id') id: Types.ObjectId | string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ) {
    //this method is also used during sign in, where there is no token
    return this.userCredentialsService.update(id, updateUserDto, response);
  }
}
