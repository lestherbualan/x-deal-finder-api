import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { OffersService } from "src/services/offers.service";
import { Offers } from "src/shared/entities/Offers";
import { OffersController } from "./offers.controller";

@Module({
  imports: [FirebaseProviderModule, TypeOrmModule.forFeature([Offers])],
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService],
})
export class OffersModule {}
