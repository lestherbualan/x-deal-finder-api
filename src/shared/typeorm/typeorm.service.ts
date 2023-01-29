import { Gender } from "./../entities/Gender";
import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Stores } from "../entities/Stores";
import { Users } from "../entities/Users";
import { EntityStatus } from "../entities/EntityStatus";
import { Offers } from "../entities/Offers";
import { OfferTypes } from "../entities/OfferTypes";
import { StoreDocuments } from "../entities/StoreDocuments";
import { Files } from "../entities/Files";
import { StoreReviews } from "../entities/StoreReviews";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "mssql",
      // host: this.config.get<string>("DATABASE_HOST"),
      // // port: Number(this.config.get<number>("DATABASE_PORT")),
      // database: this.config.get<string>("DATABASE_NAME"),
      // username: this.config.get<string>("DATABASE_USER"),
      // password: this.config.get<string>("DATABASE_PASSWORD"),
      host: "localhost",
      port: 1443,
      username: "admin",
      password: "admin123",
      database: "xdealfinderdb",
      entities: [
        Users,
        Stores,
        StoreDocuments,
        OfferTypes,
        Offers,
        Gender,
        EntityStatus,
        Files,
        StoreReviews,
      ],
      synchronize: false, // never use TRUE in production!
      options: { encrypt: false },
    };
  }
}
