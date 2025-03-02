import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type UserDoccument = HydratedDocument<User>

@Schema({ timestamps: true })

export class User {
    @Prop()
    name: string

    @Prop()
    phone: number

    @Prop()
    email: string

    @Prop()
    address: string
}

export const UserSchema = SchemaFactory.createForClass(User)