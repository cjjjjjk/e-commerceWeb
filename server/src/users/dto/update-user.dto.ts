import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
export class UpdateUserDto
{
    @IsMongoId({ message: "Invalid User ID !" })
    @IsNotEmpty({ message: "ID can not be empty !" })
    _id: string;

    @IsOptional()
    name: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    email: string;

    @IsOptional()
    address: string;

    @IsOptional()
    image: string
}