import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schema/category.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Category.name, schema: CategorySchema}])
  ],
  exports: [MongooseModule],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule {}
