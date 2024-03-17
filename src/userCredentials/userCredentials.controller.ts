import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCredentialsService } from './userCredentials.services';

@Controller('cred')
export class UserCrendtialsController {
  constructor(private userCredentialsService: UserCredentialsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async listAll(
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<void> {
    const result = await this.userCredentialsService.getAllUsersCreds();
    response.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthGuard) //only affects incoming requests, not the delegated service
  @Get()
  async userCreds(
    @Param('id') id: Types.ObjectId | string,
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<void> {
    const result = await this.userCredentialsService.findUserById(id);
    console.log('@userCreds get', result);
    response.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthGuard) //only affects incoming requests, not the delegated service
  @Patch(':id')
  async update(
    @Param('id') id: Types.ObjectId | string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ): Promise<void> {
    //this method is also used during sign in, where there is no token
    if ('password' in updateUserDto) {
      const result = await this.userCredentialsService.updateWithPasswordChange(
        id,
        updateUserDto,
      );
      response
        .status(HttpStatus.OK)
        .json({ updateWithPasswordChange: 1, result });
    } else {
      const result = this.userCredentialsService.update(id, updateUserDto);
      response.status(HttpStatus.OK).json(result);
    }
  }
}
