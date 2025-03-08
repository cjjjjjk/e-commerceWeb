import { IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateProductDto {
    @IsNotEmpty()
    name: string;

    brand: string;

    images: string[];

    size: string[];

    sex: "women"| "men" | "all";

    categoryId: ObjectId;
}