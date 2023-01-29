import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateOfferDto {
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
  @IsNotEmpty()
  due: Date;

  @ApiProperty()
  @IsNotEmpty()
  offerTypeId: string;

  @ApiProperty()
  @IsOptional()
  thumbnail: any;
}


