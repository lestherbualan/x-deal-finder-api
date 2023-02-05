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
import { CreateStoreDto } from "src/core/dto/store/store.create.dto";
import {
  AddStoreAttachmentFileDto,
  StoreDto,
  UpdateStoreThumbnailDto,
} from "src/core/dto/store/store.update.dtos";
import { StoreService } from "src/services/store.service";
import { UsersService } from "src/services/users.service";

@ApiTags("store")
@Controller("store")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get("getByAdminAdvanceSearch")
  @ApiQuery({ name: "key", required: false })
  @ApiQuery({ name: "offerTypes", required: false })
  //@UseGuards(JwtAuthGuard)
  async getByAdminAdvanceSearch(
    @Query("key") key = "",
    @Query("offerTypes") offerTypes
  ) {
    const res: CustomResponse = {};
    try {
      res.data = await this.storeService.getByAdminAdvanceSearch({
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
  @ApiQuery({ name: "userId", required: true })
  @ApiQuery({ name: "key", required: false })
  @ApiQuery({ name: "offerTypes", required: false })
  //@UseGuards(JwtAuthGuard)
  async getByClientAdvanceSearch(
    @Query("userId") userId = "",
    @Query("key") key = "",
    @Query("offerTypes") offerTypes
  ) {
    const res: CustomResponse = {};
    try {
      res.data = await this.storeService.getByClientAdvanceSearch({
        userId,
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

  @Get("getStoreAdvanceSearch")
  @ApiQuery({ name: "userId", required: true })
  @ApiQuery({ name: "dueDate", required: true })
  @ApiQuery({ name: "key", required: false })
  @ApiQuery({ name: "offerTypes", required: false })
  async getStoreAdvanceSearch(
    @Query("userId") userId = "",
    @Query("key") key = "",
    @Query("dueDate") dueDate: Date = new Date(),
    @Query("offerTypes") offerTypes
  ) {
    const res: CustomResponse = {};
    try {
      res.data = await this.storeService.getStoreAdvanceSearch({
        userId,
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
  @Get("getTopStore")
  @ApiQuery({ name: "userId", required: true })
  async getTopStore(@Query("userId") userId = "") {
    const res: CustomResponse = {};
    try {
      res.data = await this.storeService.getTopStore({
        userId,
      });
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":storeId")
  async findOne(@Param("storeId") storeId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.storeService.findById(storeId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("")
  async add(@Body() createStoreDto: CreateStoreDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.storeService.add(createStoreDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("")
  async update(@Body() storeDto: StoreDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.storeService.update(storeDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete(":storeId")
  async delete(@Param("storeId") storeId: string) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.storeService.delete(storeId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/approve/:storeId")
  async approve(@Param("storeId") storeId: string) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.storeService.approve(storeId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("addAttachmentFile")
  async addAttachmentFile(@Body() dto: AddStoreAttachmentFileDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.storeService.addAttachmentFile(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
  
  @Put("/updateStoreThumbnail")
  //@UseGuards(JwtAuthGuard)
  async updateClientProfilePicture(@Body() dto: UpdateStoreThumbnailDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.storeService.updateStoreThumbnail(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("removeAttachmentFile/:storeDocumentId")
  async removeAttachmentFile(
    @Param("storeDocumentId") storeDocumentId: string
  ) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.storeService.removeAttachmentFile(storeDocumentId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
