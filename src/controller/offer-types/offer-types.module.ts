import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OfferTypesService } from "src/services/offer-types.service";
import { OfferTypes } from "src/shared/entities/OfferTypes";
import { OfferTypesController } from "./offer-types.controller";

@Module({
  imports: [TypeOrmModule.forFeature([OfferTypes])],
  controllers: [OfferTypesController],
  providers: [OfferTypesService],
  exports: [OfferTypesService],
})
export class OfferTypesModule {}
