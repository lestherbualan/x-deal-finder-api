import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { CreateStoreReviewsDto } from "src/core/dto/store-reviews/store-reviews.create.dto";
import { StoreReviewsService } from "src/services/store-reviews.service";

@ApiTags("store-reviews")
@Controller("store-reviews")
export class StoreReviewsController {
  constructor(private readonly storeReviewsService: StoreReviewsService) {}

  @Post("")
  async add(@Body() createStoreReviewsDto: CreateStoreReviewsDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.storeReviewsService.add(createStoreReviewsDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
