import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { Stores } from "./Stores";

// @Index("PK_StoreReviews", ["userId"], { unique: true })
@Entity("StoreReviews", { schema: "dbo" })
export class StoreReviews {
  @PrimaryGeneratedColumn({ type: "bigint", name: "StoreReviewId" })
  storeReviewId: string;

  @Column("bigint", { name: "UserId" })
  userId: string;

  @Column("float", { name: "Rate", default: () => "(0)" })
  rate: string;

  @OneToOne(() => Users, (users) => users.storeReviews)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;

  @ManyToOne(() => Stores, (stores) => stores.storeReviews)
  @JoinColumn([{ name: "StoreId", referencedColumnName: "storeId" }])
  store: Stores;
}
