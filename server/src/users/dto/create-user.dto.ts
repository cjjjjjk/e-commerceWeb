import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateRestaurantDto {
    @IsNotEmpty()
    name: string;

    phone: number;

    @IsEmail() @IsNotEmpty()
    email: string;
}