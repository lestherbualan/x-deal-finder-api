import { ApiProperty } from "@nestjs/swagger";
import { IsBase64, IsNotEmpty, IsOptional } from "class-validator";

export class StoreDto {
  @ApiProperty()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;
  
  @ApiProperty()
  @IsOptional()
  thumbnail: any;

  @ApiProperty()
  @IsNotEmpty()
  socialLink: string;
}


export class AddStoreAttachmentFileDto {
  @ApiProperty()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  @IsBase64()
  data: any;
}

export class UpdateStoreThumbnailDto {
  @ApiProperty()
  @IsNotEmpty()
  storeId: string;
  
  @ApiProperty()
  @IsOptional()
  thumbnail: any;
}
