import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StoreReviews } from "./StoreReviews";
import { Stores } from "./Stores";
import { Gender } from "./Gender";
import { Files } from "./Files";
import { EntityStatus } from "./EntityStatus";

@Index("PK_Users", ["userId"], { unique: true })
@Entity("Users", { schema: "dbo" })
export class Users {
  @PrimaryGeneratedColumn({ type: "bigint", name: "UserId" })
  userId: string;

  @Column("nvarchar", { name: "FirstName", length: 250 })
  firstName: string;

  @Column("nvarchar", { name: "MiddleName", nullable: true, length: 250 })
  middleName: string | null;

  @Column("nvarchar", { name: "LastName", length: 250 })
  lastName: string;

  @Column("smallint", { name: "Age", nullable: true })
  age: number | null;

  @Column("date", { name: "BirthDate", nullable: true })
  birthDate: Date | null;

  @Column("nvarchar", { name: "Address", length: 255 })
  address: string;

  @Column("nvarchar", { name: "MobileNumber", length: 255 })
  mobileNumber: string;

  @Column("nvarchar", { name: "Username", length: 250 })
  username: string;

  @Column("nvarchar", { name: "Password", length: 250 })
  password: string;

  @Column("bit", { name: "IsLock", default: () => "(1)" })
  isLock: boolean;

  @Column("bit", { name: "IsAdminUserType", default: () => "(0)" })
  isAdminUserType: boolean;

  @Column("bit", { name: "IsAdminApproved", default: () => "(0)" })
  isAdminApproved: boolean;

  @OneToOne(() => StoreReviews, (storeReviews) => storeReviews.user)
  storeReviews: StoreReviews;

  @OneToMany(() => Stores, (stores) => stores.user)
  stores: Stores[];

  @ManyToOne(() => Gender, (gender) => gender.users)
  @JoinColumn([{ name: "GenderId", referencedColumnName: "genderId" }])
  gender: Gender;

  @ManyToOne(() => Files, (files) => files.users)
  @JoinColumn([
    { name: "ProfilePictureFileId", referencedColumnName: "fileId" },
  ])
  profilePictureFile: Files;

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.users)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;
}
