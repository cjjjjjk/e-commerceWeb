import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()  
export class Category {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, default: "all" }) 
    gender: "women" | "men" | "all";
}

export type CategoryDocument = HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);
