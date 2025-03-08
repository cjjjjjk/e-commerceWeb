import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name) 
        private UsersModule : Model<User>
    ) {}

    // CHOREs
    isEmailExist = async (email: string) => {
        const user = await this.UsersModule.exists({ email: email });
        if (user) {
          return true;
        }
        return false;
      }

    // MAINs
    // Create user ---------------------------------------------------------------------------
    // type: google (no password), defalf (with password);
    async create(createUserDTO: CreateUserDto ) {
        try {
            const {name, email, type, password, phone, address} = createUserDTO;

            
            const isEmailExist = await this.isEmailExist(email);
            if (isEmailExist) {
                throw new BadRequestException(`This email (${email}) already exists !`)
            }

            const user = await this.UsersModule.create({
                name, email, type, password, phone, address
            })

            return {
                message: "Created an user!",
                _id: user._id
            }
        } catch (err) {
            console.error("ERROR CREATING USER: ", err);
            if (err instanceof BadRequestException) throw err;
            throw new Error("Failed to creating user!");
        }
    }
    // ----------------------------------------------------------------------------------------

}
