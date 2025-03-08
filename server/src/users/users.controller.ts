import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(
        private readonly userSerVice: UsersService
    ) {}

    @Post()
    create(@Body() createUserDto :CreateUserDto) {
        return this.userSerVice.create(createUserDto);
    }
}
