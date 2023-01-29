import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FirebaseProviderModule } from "src/core/provider/firebase/firebase-provider.module";
import { StoreService } from "src/services/store.service";
import { Stores } from "src/shared/entities/Stores";
import { StoreController } from "./store.controller";

@Module({
  imports: [FirebaseProviderModule, TypeOrmModule.forFeature([Stores])],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
