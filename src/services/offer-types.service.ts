import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateOfferDto } from "src/core/dto/offer/offer.create.dto";
import { OfferDto } from "src/core/dto/offer/offer.update.dtos";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { OfferTypes } from "src/shared/entities/OfferTypes";
import { Stores } from "src/shared/entities/Stores";
import { Repository } from "typeorm";

@Injectable()
export class OfferTypesService {
  constructor(
    @InjectRepository(OfferTypes)
    private readonly offerTypeseRepo: Repository<OfferTypes>
  ) {}
  async getAll() {
    try {
      return this.offerTypeseRepo.find();
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      const store = await this.offerTypeseRepo.findOne({
        where: options,
      });
      return store;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(offerTypeId: string) {
    try {
      const offerTypes = await this.findOne({
        offerTypeId,
      });
      if (!offerTypes) {
        throw new HttpException("Offer types not found", HttpStatus.NOT_FOUND);
      }
      return offerTypes;
    } catch (e) {
      throw e;
    }
  }
}
