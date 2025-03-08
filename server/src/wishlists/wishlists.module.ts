import { Module } from '@nestjs/common';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';

@Module({
  controllers: [WishlistsController],
  providers: [WishlistsService]
})
export class WishlistsModule {}
