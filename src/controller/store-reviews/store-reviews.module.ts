import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StoreReviewsService } from "src/services/store-reviews.service";
import { StoreReviews } from "src/shared/entities/StoreReviews";
import { Stores } from "src/shared/entities/Stores";
import { StoreReviewsController } from "./store-reviews.controller";

@Module({
  imports: [TypeOrmModule.forFeature([StoreReviews, Stores])],
  controllers: [StoreReviewsController],
  providers: [StoreReviewsService],
  exports: [StoreReviewsService],
})
export class StoreReviewsModule {}
