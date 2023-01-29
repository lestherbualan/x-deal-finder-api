import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { OfferTypesService } from "src/services/offer-types.service";

@ApiTags("offer-types")
@Controller("offer-types")
export class OfferTypesController {
  constructor(private readonly offerTypesService: OfferTypesService) {}

  @Get("")
  async getByAdvanceSearchByStore() {
    const res: CustomResponse = {};
    try {
      res.data = await this.offerTypesService.getAll();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
