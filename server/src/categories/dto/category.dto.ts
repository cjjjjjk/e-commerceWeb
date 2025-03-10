import { IsNotEmpty, IsEnum } from "class-validator";
import { Types } from "mongoose";

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(["women", "men", "all"], { message: "GENDER MUST BE: 'women', 'men', or 'all'" })
  gender: "women" | "men" | "all";
}

export class GetCategoryDto {
  _id: Types.ObjectId
  name: string

  gender: string
}