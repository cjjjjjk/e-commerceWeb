import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type UserDoccument = HydratedDocument<User>

@Schema({ timestamps: true })

export class User {
    @Prop()
    name: string

    @Prop()
    email: string

    @Prop()
    type: "google" | "default"

    @Prop()
    password: string

    @Prop()
    phone: number

    @Prop()
    address: string
}

export const UserSchema = SchemaFactory.createForClass(User)