import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schemas/product.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/categories/schema/category.entity';

@Injectable()
export class ProductsService {

    constructor (
        @InjectModel(Product.name)private ProductsModule: Model<Product>,
        @InjectModel(Category.name)private CategoryModule: Model<Category>
    ) {}

    async create(createProducDto: CreateProductDto) {
        try {
            const {name,brand, images, size, sex, categoryId} = createProducDto
            const category = await this.CategoryModule.findById(categoryId);
            if (!category) {
            throw new Error("Category not found");
            }

            const product : any = await this.ProductsModule.create({
                name, brand, images, size, sex, categoryId
            })

            return {
                message: "Created a new product!",
                _id: product._id
            }

        } catch(err) {
            console.error("ERROR CREATING USER: ", err);
            if (err instanceof BadRequestException) throw err;
            throw new Error("Failed to create new product!!");
        }
    }
}
