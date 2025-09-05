import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AdminsModule } from './modules/admins/admins.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true, //to be using it throughout the project
    }),
    DatabaseModule,
    RestaurantsModule,
    ProductsModule,
    OrdersModule,
    AdminsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
