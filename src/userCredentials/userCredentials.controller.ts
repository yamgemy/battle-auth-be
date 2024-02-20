import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCredentials } from './schemas/userCredentials.schema';
import { UserCredentialsService } from './userCredentials.services';

@Controller('cred')
export class UserCrendtialsController {
  constructor(private userCredentialsService: UserCredentialsService) {}

  @Get()
  async listAll(): Promise<UserCredentials[]> {
    const result = await this.userCredentialsService.getAllUsersCreds();
    return result;
  }

  @Patch(':id')
  update(
    @Param('id') id: Types.ObjectId | string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userCredentialsService.update(id, updateUserDto);
  }
}
