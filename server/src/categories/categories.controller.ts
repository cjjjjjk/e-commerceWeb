import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, GetCategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoriesController {

    constructor(
        private readonly categoriesService: CategoriesService
    ) {}

    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return await this.categoriesService.create(createCategoryDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) :Promise<GetCategoryDto> {
        return this.categoriesService.findOne(id);
    }

    @Get()
    async findAll() : Promise<GetCategoryDto[]>{
        return await this.categoriesService.findAll();
    }
}
