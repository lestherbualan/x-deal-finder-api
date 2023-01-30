import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class OfferDto {
  @ApiProperty()
  @IsNotEmpty()
  offerId: string;
  
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  dealOffer: string;

  @ApiProperty()
  @IsNotEmpty()
  location: string;

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
