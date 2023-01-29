import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Stores } from "./Stores";
import { Files } from "./Files";
import { EntityStatus } from "./EntityStatus";

@Index("PK_StoreDocuments", ["storeDocumentId"], { unique: true })
@Entity("StoreDocuments", { schema: "dbo" })
export class StoreDocuments {
  @PrimaryGeneratedColumn({ type: "bigint", name: "StoreDocumentId" })
  storeDocumentId: string;

  @ManyToOne(() => Stores, (stores) => stores.storeDocuments)
  @JoinColumn([{ name: "StoreId", referencedColumnName: "storeId" }])
  store: Stores;

  @ManyToOne(() => Files, (files) => files.storeDocuments)
  @JoinColumn([{ name: "FileId", referencedColumnName: "fileId" }])
  file: Files;

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.storeDocuments)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;
}
