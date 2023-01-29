import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Offers } from "./Offers";
import { StoreDocuments } from "./StoreDocuments";
import { StoreReviews } from "./StoreReviews";
import { Users } from "./Users";
import { Files } from "./Files";
import { EntityStatus } from "./EntityStatus";

@Index("PK_Stores", ["storeId"], { unique: true })
@Entity("Stores", { schema: "dbo" })
export class Stores {
  @PrimaryGeneratedColumn({ type: "bigint", name: "StoreId" })
  storeId: string;

  @Column("nvarchar", { name: "Name", length: 50 })
  name: string;

  @Column("nvarchar", { name: "Description" })
  description: string;

  @Column("bigint", { name: "Reviews", default: () => "(0)" })
  reviews: string;

  @Column("bit", { name: "IsApproved", default: () => "(0)" })
  isApproved: boolean;

  @OneToMany(() => Offers, (offers) => offers.store)
  offers: Offers[];

  @OneToMany(() => StoreDocuments, (storeDocuments) => storeDocuments.store)
  storeDocuments: StoreDocuments[];

  @OneToMany(() => StoreReviews, (storeReviews) => storeReviews.store)
  storeReviews: StoreReviews[];

  @ManyToOne(() => Users, (users) => users.stores)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;

  @ManyToOne(() => Files, (files) => files.stores)
  @JoinColumn([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }])
  thumbnailFile: Files;

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.stores)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;
}
