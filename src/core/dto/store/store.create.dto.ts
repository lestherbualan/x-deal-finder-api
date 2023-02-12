import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateStoreDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: string;
  
  @ApiProperty()
  @IsOptional()
  storeDocuments: any[];

  @ApiProperty()
  @IsOptional()
  thumbnail: any;

  @ApiProperty()
  @IsNotEmpty()
  socialLink: string;
}


