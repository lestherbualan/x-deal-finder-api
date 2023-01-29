import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Offers } from "./Offers";
import { StoreDocuments } from "./StoreDocuments";
import { Stores } from "./Stores";
import { Users } from "./Users";

@Index("PK_Files", ["fileId"], { unique: true })
@Entity("Files", { schema: "dbo" })
export class Files {
  @PrimaryGeneratedColumn({ type: "bigint", name: "FileId" })
  fileId: string;

  @Column("nvarchar", { name: "OriginalFileName" })
  originalFileName: string;

  @Column("nvarchar", { name: "FileName" })
  fileName: string;

  @Column("varchar", { name: "Url", nullable: true })
  url: string | null;

  @OneToMany(() => Offers, (offers) => offers.thumbnailFile)
  offers: Offers[];

  @OneToMany(() => StoreDocuments, (storeDocuments) => storeDocuments.file)
  storeDocuments: StoreDocuments[];

  @OneToMany(() => Stores, (stores) => stores.thumbnailFile)
  stores: Stores[];

  @OneToMany(() => Users, (users) => users.profilePictureFile)
  users: Users[];
}
