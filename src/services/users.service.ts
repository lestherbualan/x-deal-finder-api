/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, ILike, Like } from "typeorm";
import {
  compare,
  hash,
  getAge,
  isStaffRegistrationApproved,
} from "../common/utils/utils";
import { Users } from "../shared/entities/Users";
import { Gender } from "../shared/entities/Gender";
import { EntityStatus } from "../shared/entities/EntityStatus";
import { query } from "express";
import { CreateUserDto } from "src/core/dto/users/user.create.dto";
import {
  UpateUserDto,
  UpateUserPasswordDto,
} from "src/core/dto/users/user.update.dto";
import { extname } from "path";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Files } from "src/shared/entities/Files";
import { v4 as uuid } from "uuid";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly userRepo: Repository<Users>,
    private firebaseProvoder: FirebaseProvider
  ) {}

  async getAllAdminUserType(keyword: string) {
    return <Users[]> await this.userRepo.manager
    .createQueryBuilder("Users", "u")
    .leftJoinAndSelect("u.gender", "o")
    .leftJoinAndSelect("u.profilePictureFile", "es")
    .where(
      "u.isAdminUserType =:isAdminUserType AND (" +
      "u.userId LIKE :key OR " +
    "u.firstName LIKE :key OR " +
    "u.middleName LIKE :key OR " +
    "u.lastName LIKE :key OR " +
    "u.birthDate LIKE :key OR " +
    "u.address LIKE :key OR " +
    "u.username LIKE :key)")
    .setParameters({ key: `%${keyword ? keyword : ""}%`, isAdminUserType: true })
    .getMany();

  }
  async getAllClientUserType(keyword: string) {
    return <Users[]> await this.userRepo.manager
    .createQueryBuilder("Users", "u")
    .leftJoinAndSelect("u.gender", "o")
    .leftJoinAndSelect("u.stores", "s")
    .leftJoinAndSelect("u.profilePictureFile", "es")
    .where(
      "u.isAdminUserType =:isAdminUserType AND (" +
      "u.userId LIKE :key OR " +
    "u.firstName LIKE :key OR " +
    "u.middleName LIKE :key OR " +
    "u.lastName LIKE :key OR " +
    "u.birthDate LIKE :key OR " +
    "u.address LIKE :key OR " +
    "u.username LIKE :key)")
    .setParameters({ key: `%${keyword ? keyword : ""}%`, isAdminUserType: false })
    .getMany();

  }

  async findById(userId) {
    const result = await this.userRepo.findOne({
      where: { userId },
      relations: ["gender", "stores"],
    });
    if (!result) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    return {
      ...this._sanitizeUser(result),
      fullName:
        result.firstName +
        (result.middleName && result.middleName !== ""
          ? " " + result.middleName + " "
          : " ") +
        result.lastName,
    };
  }

  async findByLogin(username, password, isAdminUserType) {
    const result = await this.userRepo.findOne({
      where: { username, isAdminUserType },
      relations: ["gender"],
    });
    if (!result) {
      throw new HttpException("Username not found", HttpStatus.NOT_FOUND);
    }
    if (result.isLock) {
      throw new HttpException("Yout account has been locked", HttpStatus.OK);
    }
    const areEqual = await compare(result.password, password);
    if (!areEqual) {
      throw new HttpException("Invalid credentials", HttpStatus.NOT_ACCEPTABLE);
    }
    return this._sanitizeUser(result);
  }

  async findByUsername(username) {
    try {
      const result = await this.userRepo.findOne({
        where: { username },
      });
      if (result) {
        return this._sanitizeUser(result);
      } else {
        return null;
      }
    } catch (e) {
      throw e;
    }
  }

  async create(userDto: CreateUserDto, isAdminUserType: boolean) {
    const { username } = userDto;

    return await this.userRepo.manager.transaction(async (entityManager) => {
      const userInDb = await entityManager.findOne(Users, {
        where: { username },
      });
      if (userInDb) {
        throw new HttpException("Username already exist", HttpStatus.CONFLICT);
      }
      let user = new Users();
      user.isAdminUserType = isAdminUserType;
      user.isLock = false;
      user.username = userDto.username;
      user.password = await hash(userDto.password);
      user.entityStatus = new EntityStatus();
      user.entityStatus.entityStatusId = "1";
      user.isAdminApproved = true;
      user.firstName = userDto.firstName;
      user.middleName = userDto.middleName;
      user.lastName = userDto.lastName;
      user.mobileNumber = userDto.mobileNumber;
      user.address = userDto.address;
      user.birthDate = userDto.birthDate;
      user.age = await getAge(userDto.birthDate);
      user.gender = new Gender();
      user.gender.genderId = userDto.genderId;
      user = await entityManager.save(Users, user);
      return await this._sanitizeUser(user);
    });
  }

  async register(userDto: CreateUserDto, isAdminUserType: boolean) {
    const { username } = userDto;

    return await this.userRepo.manager.transaction(async (entityManager) => {
      const userInDb = await entityManager.findOne(Users, {
        where: { username },
      });
      if (userInDb) {
        throw new HttpException("Username already taken", HttpStatus.CONFLICT);
      }
      let user = new Users();
      user.isLock = isAdminUserType;
      user.isAdminUserType = isAdminUserType;
      user.username = userDto.username;
      user.password = await hash(userDto.password);
      user.entityStatus = new EntityStatus();
      user.entityStatus.entityStatusId = "1";
      user.firstName = userDto.firstName;
      user.middleName = userDto.middleName;
      user.lastName = userDto.lastName;
      user.mobileNumber = userDto.mobileNumber;
      user.address = userDto.address;
      user.birthDate = userDto.birthDate;
      user.age = await getAge(userDto.birthDate);
      user.gender = new Gender();
      user.gender.genderId = userDto.genderId;
      user = await entityManager.save(Users, user);
      return await this._sanitizeUser(user);
    });
  }

  async update(userDto: UpateUserDto) {
    const userId = userDto.userId;

    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        where: { userId },
        relations: ["profilePictureFile"],
      });
      if (!user) {
        throw new HttpException(`User doesn't exist`, HttpStatus.NOT_FOUND);
      }
      user.firstName = userDto.firstName;
      user.middleName = userDto.middleName;
      user.lastName = userDto.lastName;
      user.mobileNumber = userDto.mobileNumber;
      user.address = userDto.address;
      user.birthDate = userDto.birthDate;
      user.age = await getAge(userDto.birthDate);
      user.gender = new Gender();
      user.gender.genderId = userDto.genderId;

      if (userDto.profilePictureFile) {
        const newFileName: string = uuid();
        const bucket = this.firebaseProvoder.app.storage().bucket();
        if (user.profilePictureFile) {
          try {
            const deleteFile = bucket.file(
              `profile/${user.profilePictureFile.fileName}`
            );
            deleteFile.delete();
          } catch (ex) {
            console.log(ex);
          }
          const file = user.profilePictureFile;
          file.fileName = `${newFileName}${extname(
            userDto.profilePictureFile.fileName
          )}`;
          file.originalFileName = userDto.profilePictureFile.fileName;

          const bucketFile = bucket.file(
            `profile/${newFileName}${extname(file.fileName)}`
          );
          const img = Buffer.from(userDto.profilePictureFile.data, "base64");
          await bucketFile.save(img).then(async () => {
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
            file.url = url[0];
            user.profilePictureFile = await entityManager.save(Files, file);
          });
        } else {
          const file = new Files();
          file.fileName = `${newFileName}${extname(
            userDto.profilePictureFile.fileName
          )}`;
          file.originalFileName = userDto.profilePictureFile.originalFileName;

          const bucketFile = bucket.file(
            `profile/${newFileName}${extname(file.fileName)}`
          );
          const img = Buffer.from(userDto.profilePictureFile.data, "base64");
          await bucketFile.save(img).then(async () => {
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
            file.url = url[0];
            user.profilePictureFile = await entityManager.save(Files, file);
          });
        }
      }

      user = await entityManager.save(Users, user);
      return await this._sanitizeUser(user);
    });
  }

  async updatePassword(upateUserPasswordDto: UpateUserPasswordDto) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        where: { userId: upateUserPasswordDto.userId },
      });
      if (!user) {
        throw new HttpException("user not found", HttpStatus.CONFLICT);
      }
      user.password = await hash(upateUserPasswordDto.password);
      user = await entityManager.save(Users, user);
      user = await this._sanitizeUser(user);
      return user;
    });
  }

  async toggleLock(isLock: boolean, userId: string) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        where: { userId },
      });
      if (!user) {
        throw new HttpException("user not found", HttpStatus.CONFLICT);
      }
      user.isLock = isLock;
      user = await entityManager.save(Users, user);
      return await this._sanitizeUser(user);
    });
  }

  async approveAdminUser(userId: string) {
    return await this.userRepo.manager.transaction(async (entityManager) => {
      let user = await entityManager.findOne(Users, {
        where: { userId },
      });
      if (!user) {
        throw new HttpException("user not found", HttpStatus.CONFLICT);
      }
      user.isAdminApproved = true;
      user = await entityManager.save(Users, user);
      return await this._sanitizeUser(user);
    });
  }

  private _sanitizeUser(user: Users) {
    delete user.password;
    return user;
  }
}
