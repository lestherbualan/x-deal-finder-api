import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { UsersModule } from "./controller/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./shared/typeorm/typeorm.service";
import { getEnvPath } from "./common/helper/env.helper";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./controller/auth/auth.module";
import { FileModule } from "./controller/file/file.module";
import { StoreModule } from "./controller/store/store.module";
import { OffersModule } from "./controller/offers/offers.module";
import { OfferTypesModule } from "./controller/offer-types/offer-types.module";
import { StoreReviewsModule } from "./controller/store-reviews/store-reviews.module";
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    UsersModule,
    FileModule,
    StoreModule,
    OffersModule,
    OfferTypesModule,
    StoreReviewsModule,
  ],
  providers: [AppService],
  controllers: [],
})
export class AppModule {}
