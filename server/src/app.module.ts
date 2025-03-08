import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { WishlistsModule } from './wishlists/wishlists.module';


@Module({
  imports: [  
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        console.log('Connnect Mongoose: ', uri)
        return {uri};
      },
      inject: [ConfigService],
    }), 
    UsersModule,
    CategoriesModule,
    ProductsModule,
    WishlistsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
