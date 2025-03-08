import { IsNotEmpty, IsEnum } from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(["women", "men", "all"], { message: "GENDER MUST BE: 'women', 'men', or 'all'" })
  gender: "women" | "men" | "all";
}
