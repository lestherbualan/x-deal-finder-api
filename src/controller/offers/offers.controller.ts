import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import * as moment from "moment";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { CreateOfferDto } from "src/core/dto/offer/offer.create.dto";
import { OfferDto } from "src/core/dto/offer/offer.update.dtos";
import { OffersService } from "src/services/offers.service";

@ApiTags("offers")
@Controller("offers")
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get("getByAdvanceSearchByStore")
  @ApiQuery({ name: "storeId", required: true })
  @ApiQuery({ name: "status", required: true })
  @ApiQuery({ name: "dueDate", required: true })
  @ApiQuery({ name: "key", required: false })
  @ApiQuery({ name: "offerTypes", required: false })
  //@UseGuards(JwtAuthGuard)
  async getByAdvanceSearchByStore(
    @Query("storeId") storeId = "",
    @Query("status") status = "",
    @Query("dueDate") dueDate: Date = new Date(),
    @Query("key") key = "",
    @Query("offerTypes") offerTypes
  ) {
    const res: CustomResponse = {};
    try {
      res.data = await this.offersService.getByAdvanceSearchByStore({
        storeId,
        status,
        dueDate,
        key,
        offerTypes: offerTypes ? offerTypes.trim().split(",") : [],
      });
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getByClientAdvanceSearch")
  @ApiQuery({ name: "userId", required: false })
  @ApiQuery({ name: "key", required: false })
  @ApiQuery({ name: "dueDate", required: true })
  @ApiQuery({ name: "offerTypes", required: false })
  //@UseGuards(JwtAuthGuard)
  async getByClientAdvanceSearch(
    @Query("userId") userId = "",
    @Query("key") key = "",
    @Query("dueDate") dueDate: Date = new Date(),
    @Query("offerTypes") offerTypes: string
  ) {
    const res: CustomResponse = {};
    try {
      res.data = await this.offersService.getByClientAdvanceSearch({
        userId,
        key,
        dueDate: new Date(
          moment(`${moment(dueDate).format("YYYY-MM-DD")} 00:00`).format(
            "YYYY-MM-DD HH:mm"
          )
        ),
        offerTypes: offerTypes ? offerTypes.trim().split(",") : [],
      });
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":offerId")
  async findOne(@Param("offerId") storeId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.offersService.findById(storeId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("")
  async add(@Body() createOfferDto: CreateOfferDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.offersService.add(createOfferDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("")
  async update(@Body() offerDto: OfferDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.offersService.update(offerDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete(":offerId")
  async delete(@Param("offerId") offerId: string) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.offersService.delete(offerId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
