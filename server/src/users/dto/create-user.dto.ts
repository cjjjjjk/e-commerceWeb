import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail() @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    type: "google" | "default"

    phone: number;

    address: string;

    password: string;   
}