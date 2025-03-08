import { HydratedDocument, ObjectId, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export class Product {
    @Prop()
    name: string

    @Prop()
    brand: string;

    @Prop()
    images: string[];

    @Prop()
    size: string[];

    @Prop()
    sex: "women"| "men" | "all";

    @Prop({type: Types.ObjectId, ref: "Category", required: true})
    categoryId: ObjectId;
}

export type ProductDocument = HydratedDocument<Product>
export const ProductSchema = SchemaFactory.createForClass(Product)
