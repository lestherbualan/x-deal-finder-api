import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateStoreReviewsDto } from "src/core/dto/store-reviews/store-reviews.create.dto";
import { OfferTypes } from "src/shared/entities/OfferTypes";
import { StoreReviews } from "src/shared/entities/StoreReviews";
import { Stores } from "src/shared/entities/Stores";
import { Users } from "src/shared/entities/Users";
import { Repository } from "typeorm";

@Injectable()
export class StoreReviewsService {
  constructor(
    @InjectRepository(StoreReviews)
    private readonly storeReviewsRepo: Repository<StoreReviews>
  ) {}
  async add(dto: CreateStoreReviewsDto) {
    try {
      const { userId, storeId, rate } = dto;
      return await this.storeReviewsRepo.manager.transaction(
        async (entityManager) => {
          const isInDB = await entityManager.findOne(StoreReviews, {
            where: { userId, store: { storeId } },
          });
          if (isInDB) {
            const store = await entityManager.findOne(Stores, {
              where: { storeId },
              relations: {
                storeReviews: true,
              },
            });
            const numOfReviews = store.storeReviews.length;

            const currentTotalRating = store.storeReviews
              .map((x) => {
                return Number(x.rate);
              })
              .reduce((partialSum, a) => partialSum + a, 0);
            const newRating =
              currentTotalRating - Number(isInDB.rate) + Number(rate);
            const reviews =
              numOfReviews > 0 ? newRating / numOfReviews : newRating;

            await this.updateStoreReviews(storeId, reviews);
            isInDB.rate = rate;
            return await entityManager.save(StoreReviews, isInDB);
          } else {
            const storeReviews = new StoreReviews();
            storeReviews.user = await entityManager.findOne(Users, {
              where: { userId },
            });
            let store = await entityManager.findOne(Stores, {
              where: { storeId },
              relations: {
                storeReviews: true,
              },
            });

            const numOfReviews = store.storeReviews.length + 1;
            storeReviews.rate = rate;

            const currentTotalRating = store.storeReviews
              .map((x) => {
                return Number(x.rate);
              })
              .reduce((partialSum, a) => partialSum + a, 0);
            const newRating = currentTotalRating + Number(rate);
            const reviews =
              numOfReviews > 0 ? newRating / numOfReviews : newRating;
            store = await this.updateStoreReviews(storeId, reviews);
            storeReviews.store = store;
            return await entityManager.save(StoreReviews, storeReviews);
          }
        }
      );
    } catch (e) {
      throw e;
    }
  }

  private async updateStoreReviews(storeId, reviews) {
    try {
      return await this.storeReviewsRepo.manager.transaction(
        async (entityManager) => {
          const store = await entityManager.findOne(Stores, {
            where: { storeId },
            relations: {
              storeReviews: true,
            },
          });
          store.reviews = reviews;
          return await entityManager.save(Stores, store);
        }
      );
    } catch (e) {
      throw e;
    }
  }
}
