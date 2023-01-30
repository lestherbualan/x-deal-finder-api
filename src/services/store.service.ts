import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { extname } from "path";
import { CreateStoreDto } from "src/core/dto/store/store.create.dto";
import {
  AddStoreAttachmentFileDto,
  StoreDto,
  UpdateStoreThumbnailDto,
} from "src/core/dto/store/store.update.dtos";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Files } from "src/shared/entities/Files";
import { OfferTypes } from "src/shared/entities/OfferTypes";
import { StoreDocuments } from "src/shared/entities/StoreDocuments";
import { Stores } from "src/shared/entities/Stores";
import { Users } from "src/shared/entities/Users";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";
import { FirebaseApp, initializeApp } from 'firebase/app';
import { deleteObject, FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { firebaseConfig } from "../core/provider/firebase/firestore-config";

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Stores)
    private readonly storeRepo: Repository<Stores>,
    private firebaseProvoder: FirebaseProvider
  ) {}

  async getByAdminAdvanceSearch(params: { key: string; offerTypes: any[] }) {
    try {
      const options = params as any;
      options.offerTypes = params.offerTypes.map((x) => {
        return x.toLowerCase();
      });
      options.key = `%${params.key ? params.key : ""}%`;
      options.entityStatusId = 1;
      let q = this.storeRepo.manager
        .createQueryBuilder("Stores", "s")
        .leftJoinAndSelect("s.thumbnailFile", "tf")
        .leftJoinAndSelect("s.user", "u")
        .leftJoinAndSelect("s.offers", "o")
        .leftJoinAndSelect("s.entityStatus", "es")
        .leftJoinAndSelect("o.offerType", "ot");
      if (options.offerTypes.length > 0) {
        q = q.andWhere(
          "es.entityStatusId = :entityStatusId AND " +
            "LOWER(ot.name) IN(:...offerTypes) AND " +
            "(s.name LIKE :key OR s.description LIKE :key)"
        );
      } else {
        q = q.andWhere(
          "es.entityStatusId = :entityStatusId AND " +
            "(s.name LIKE :key OR s.description LIKE :key)"
        );
      }
      q.setParameters(options).orderBy("o.due", "ASC");
      return <Stores[]>await q.getMany();
    } catch (e) {
      throw e;
    }
  }

  async getByClientAdvanceSearch(params: {
    userId: string;
    key: string;
    offerTypes: any[];
  }) {
    try {
      const options = params as any;
      options.offerTypes = params.offerTypes.map((x) => {
        return x.toLowerCase();
      });
      options.key = `%${params.key ? params.key : ""}%`;
      options.entityStatusId = 1;
      let q = this.storeRepo.manager
        .createQueryBuilder("Stores", "s")
        .leftJoinAndSelect("s.thumbnailFile", "tf")
        .leftJoinAndSelect("s.user", "u")
        .leftJoinAndSelect("s.offers", "o")
        .leftJoinAndSelect("s.entityStatus", "es")
        .leftJoinAndSelect("o.offerType", "ot");

      if (options.offerTypes.length > 0) {
        q = q.where(
          "u.userId = :userId AND " +
            "es.entityStatusId = :entityStatusId AND " +
            "LOWER(ot.name) IN(:...offerTypes) AND " +
            "(s.name LIKE :key OR s.description LIKE :key)"
        );
      } else {
        q = q.where(
          "u.userId = :userId AND " +
            "es.entityStatusId = :entityStatusId AND " +
            "(s.name LIKE :key OR s.description LIKE :key)"
        );
      }
      q.setParameters(options).orderBy("o.due", "ASC");
      return <Stores[]>await q.getMany();
    } catch (e) {
      throw e;
    }
  }

  async getStoreAdvanceSearch(params: {
    userId: string;
    key: string;
    dueDate: Date;
    offerTypes: any[];
  }) {
    try {
      const options = params as any;
      options.offerTypes = params.offerTypes.map((x) => {
        return x.toLowerCase();
      });
      options.key = `%${params.key ? params.key : ""}%`;
      options.entityStatusId = 1;
      options.isApproved = true;
      let q = this.storeRepo.manager
        .createQueryBuilder("Stores", "s")
        .leftJoinAndSelect("s.thumbnailFile", "tf")
        .leftJoinAndSelect("s.offers", "o")
        .leftJoinAndSelect("s.entityStatus", "es")
        .leftJoinAndSelect("o.offerType", "ot")
        .leftJoinAndSelect("s.user", "u");

      if (options.offerTypes.length > 0) {
        q = q.where(
          "u.userId <> :userId AND " +
            "o.due >= :dueDate AND " +
            "s.isApproved = :isApproved AND " +
            "es.entityStatusId = :entityStatusId AND " +
            "LOWER(ot.name) IN(:...offerTypes) AND " +
            "(s.name LIKE :key OR s.description LIKE :key)"
        );
      } else {
        q = q.where(
          "u.userId <> :userId AND " +
            "o.due >= :dueDate AND " +
            "s.isApproved = :isApproved AND " +
            "es.entityStatusId = :entityStatusId AND " +
            "(s.name LIKE :key OR s.description LIKE :key)"
        );
      }
      q.setParameters(options).orderBy("s.reviews", "ASC");
      return <Stores[]>await q.getMany();
    } catch (e) {
      throw console.log(e.query);
    }
  }

  async getTopStore(params: { userId: string }) {
    try {
      const options = params as any;
      options.entityStatusId = 1;
      options.isApproved = true;
      const q = this.storeRepo.manager
        .createQueryBuilder("Stores", "s")
        .leftJoinAndSelect("s.thumbnailFile", "tf")
        .leftJoinAndSelect("s.offers", "o")
        .leftJoinAndSelect("s.entityStatus", "es")
        .leftJoinAndSelect("o.offerType", "ot")
        .leftJoinAndSelect("s.user", "u")
        .leftJoinAndSelect("s.storeReviews", "sr")
        .where(
          "u.userId <> :userId AND s.isApproved = :isApproved AND es.entityStatusId = :entityStatusId"
        );
      q.setParameters(options).orderBy("s.reviews", "DESC");
      return <Stores[]>await q.getMany();
    } catch (e) {
      console.log(e.message)
      throw console.log(e.query);
    }
  }

  async findOne(options?: any) {
    try {
      const store = await this.storeRepo.findOne({
        where: options,
        relations: {
          entityStatus: true,
          storeDocuments: {
            file: true,
          },
          user: true,
          storeReviews: {
            user: true,
          },
          thumbnailFile: true,
        },
      });
      return store;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(storeId: string) {
    try {
      const store = await this.findOne({
        storeId,
        entityStatus: { entityStatusId: "1" },
      });
      if (!store) {
        throw new HttpException("Store not found", HttpStatus.NOT_FOUND);
      }
      delete store.user.password;
      if (store.storeReviews.length > 0) {
        for (const r of store.storeReviews) {
          delete r.user.password;
        }
      }
      const offersTypes = <any[]>(
        await this.storeRepo.manager
          .createQueryBuilder("OfferTypes", "ot")
          .leftJoin("ot.offers", "o")
          .leftJoin("o.store", "s")
          .where("s.storeId =:storeId")
          .setParameters({ storeId })
          .getMany()
      );

      return {
        ...store,
        storeOfferTypes: [
          ...new Set(
            offersTypes.map((o) => {
              return o.name;
            })
          ),
        ].join(" | "),
      };
    } catch (e) {
      throw e;
    }
  }

  async add(createStoreDto: CreateStoreDto) {
    try {
      return await this.storeRepo.manager.transaction(async (entityManager) => {
        let store = new Stores();
        store.name = createStoreDto.name;
        store.description = createStoreDto.description;
        store.isApproved = false;
        store.user = await entityManager.findOneBy(Users, {
          userId: createStoreDto.userId,
        });
        if (createStoreDto.thumbnail) {
          const newFileName: string = uuid();
          const bucket = this.firebaseProvoder.app.storage().bucket();

          const file = new Files();
          file.fileName = `${newFileName}${extname(
            createStoreDto.thumbnail.fileName
          )}`;
          file.originalFileName = createStoreDto.thumbnail.fileName;
          const app = initializeApp(firebaseConfig);
          const storeApp = getStorage(app);
          const img = Buffer.from(createStoreDto.thumbnail.data, "base64");
            
          const imageRef = ref(storeApp, `store/profile/${newFileName}${extname(file.fileName)}`);

          await uploadBytes(imageRef, img).then(async()=>{
            file.url = await getDownloadURL(imageRef);
            store.thumbnailFile = await entityManager.save(Files, file);
          }).catch((error)=>{
            console.log(error.message);
            throw error;
          });
        }
        store = await entityManager.save(store);
        if (
          createStoreDto.storeDocuments &&
          createStoreDto.storeDocuments.length > 0
        ) {
          for (const document of createStoreDto.storeDocuments) {
            if (document) {
              let storeDocument = new StoreDocuments();
              const newFileName: string = uuid();
              const bucket = this.firebaseProvoder.app.storage().bucket();

              const file = new Files();
              file.fileName = `${newFileName}${extname(document.fileName)}`;
              file.originalFileName = document.fileName;

              const bucketFile = bucket.file(
                `store/files/${newFileName}${extname(document.fileName)}`
              );
              const img = Buffer.from(document.data, "base64");
              await bucketFile.save(img).then(async () => {
                const url = await bucketFile.getSignedUrl({
                  action: "read",
                  expires: "03-09-2500",
                });
                file.url = url[0];
                storeDocument.file = await entityManager.save(Files, file);
              });
              storeDocument.store = store;
              storeDocument = await entityManager.save(
                StoreDocuments,
                storeDocument
              );
            }
          }
        }
        return await entityManager.findOne(Stores, {
          where: { storeId: store.storeId },
          relations: {
            entityStatus: true,
            storeDocuments: {
              file: true,
            },
            user: true,
          },
        });
      });
    } catch (e) {
      console.log(e.message)
      throw e;
    }
  }

  async update(dto: StoreDto) {
    try {
      return await this.storeRepo.manager.transaction(async (entityManager) => {
        const { storeId } = dto;
        const store = await entityManager.findOne(Stores, {
          where: {
            storeId,
            entityStatus: { entityStatusId: "1" },
          },
          relations: {
            thumbnailFile: true,
          },
        });
        if (!store) {
          throw new HttpException("Store not found", HttpStatus.NOT_FOUND);
        }
        store.name = dto.name;
        store.description = dto.description;

        if (dto.thumbnail) {
          if (store.thumbnailFile) {
            const newFileName: string = uuid();
            const bucket = this.firebaseProvoder.app.storage().bucket();
  
            const file = new Files();
            file.fileName = `${newFileName}${extname(
              dto.thumbnail.fileName
            )}`;
            file.originalFileName = dto.thumbnail.fileName;
            const app = initializeApp(firebaseConfig);
            const storeApp = getStorage(app);
            const img = Buffer.from(dto.thumbnail.data, "base64");
              
            const imageRef = ref(storeApp, `store/profile/${newFileName}${extname(file.fileName)}`);
  
            await uploadBytes(imageRef, img).then(async()=>{
              file.url = await getDownloadURL(imageRef);
              store.thumbnailFile = await entityManager.save(Files, file);
            }).catch((error)=>{
              console.log(error.message);
              throw error;
            });


            // const newFileName: string = uuid();
            // const app = initializeApp(firebaseConfig);
            // const storeApp = getStorage(app);
            // const file = new Files();
            // file.fileName = `${newFileName}${extname(
            //   dto.thumbnail.fileName
            // )}`;
            // file.originalFileName = dto.thumbnail.fileName;
            
            // const img = Buffer.from(dto.thumbnail.data, "base64");
            // const imageRef = ref(storeApp, `store/profile/${newFileName}${extname(file.fileName)}`);
            // await uploadBytes(imageRef, img).then(async()=>{
            //   console.log("shes here")
            //   file.url = await getDownloadURL(imageRef);
            //   store.thumbnailFile = await entityManager.save(Files, file);
            // }).catch((error)=>{
            //   console.log(error.message);
            //   throw error;
            // });
            // try {
            //   const deleteFile = bucket.file(
            //     `store/profile/${store.thumbnailFile.fileName}`
            //   );
            //   deleteFile.delete();
            // } catch (ex) {
            //   console.log(ex);
            // }
            // const file = store.thumbnailFile;
            // file.fileName = `${newFileName}${extname(dto.thumbnail.fileName)}`;
            // file.originalFileName = dto.thumbnail.fileName;
            // const bucketFile = bucket.file(
            //   `store/profile/${newFileName}${extname(dto.thumbnail.fileName)}`
            // );
            // const img = Buffer.from(dto.thumbnail.data, "base64");
            // await bucketFile.save(img).then(async () => {
            //   const url = await bucketFile.getSignedUrl({
            //     action: "read",
            //     expires: "03-09-2500",
            //   });
            //   file.url = url[0];
            //   store.thumbnailFile = await entityManager.save(Files, file);
            // });
          } else {
            
            const file = new Files();
            const newFileName: string = uuid();
            file.fileName = `${newFileName}${extname(dto.thumbnail.fileName)}`;
            file.originalFileName = dto.thumbnail.fileName;
            const app = initializeApp(firebaseConfig);
            const storeApp = getStorage(app);
              
            const imageRef = ref(storeApp, `store/profile/${newFileName}${extname(file.fileName)}`);

            // const bucketFile = bucket.file(
            //   `store/profile/${newFileName}${extname(dto.thumbnail.fileName)}`
            // );
            const img = Buffer.from(dto.thumbnail.data, "base64");
            await uploadBytes(imageRef, img).then(async()=>{
              file.url = await getDownloadURL(imageRef);
              store.thumbnailFile = await entityManager.save(Files, file);
            }).catch((error)=>{
              console.log(error.message);
              throw error;
            });
            // await bucketFile.save(img).then(async () => {
            //   const url = await bucketFile.getSignedUrl({
            //     action: "read",
            //     expires: "03-09-2500",
            //   });
            //   file.url = url[0];
            //   store.thumbnailFile = await entityManager.save(Files, file);
            // });
          }
        }

        return await entityManager.save(store);
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(storeId: string) {
    try {
      return await this.storeRepo.manager.transaction(async (entityManager) => {
        const store = await entityManager.findOne(Stores, {
          where: {
            storeId,
            entityStatus: { entityStatusId: "1" },
          },
          relations: {
            entityStatus: true,
          },
        });
        if (!store) {
          throw new HttpException("Store not found", HttpStatus.NOT_FOUND);
        }
        store.entityStatus.entityStatusId = "2";
        return await this.storeRepo.save(store);
      });
    } catch (e) {
      throw e;
    }
  }

  async approve(storeId: string) {
    try {
      const store = await this.findOne({
        storeId,
        entityStatus: { entityStatusId: "1" },
      });
      if (!store) {
        throw new HttpException("Store not found", HttpStatus.NOT_FOUND);
      }
      store.isApproved = true;
      return await this.storeRepo.save(store);
    } catch (e) {
      throw e;
    }
  }

  async addAttachmentFile(dto: AddStoreAttachmentFileDto) {
    try {
      return await this.storeRepo.manager.transaction(async (entityManager) => {
        if (dto.data) {
          const documents = new StoreDocuments();
          const newFileName: string = uuid();
          const bucket = this.firebaseProvoder.app.storage().bucket();

          const file = new Files();
          file.fileName = `${newFileName}${extname(dto.fileName)}`;
          file.originalFileName = dto.fileName;
          const bucketFile = bucket.file(
            `store/files/${newFileName}${extname(dto.fileName)}`
          );
          const img = Buffer.from(dto.data, "base64");
          await bucketFile.save(img).then(async () => {
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
            file.url = url[0];
            documents.file = await entityManager.save(Files, file);
          });
          documents.store = await entityManager.findOneBy(Stores, {
            storeId: dto.storeId,
          });
          await entityManager.save(StoreDocuments, documents);
          return entityManager.find(StoreDocuments, {
            where: {
              store: { storeId: dto.storeId },
            },
            relations: ["file"],
          });
        } else {
          return [];
        }
      });
    } catch (e) {
      throw e;
    }
  }

  async updateStoreThumbnail(dto: UpdateStoreThumbnailDto) {
    const storeId = dto.storeId;
    return await this.storeRepo.manager.transaction(async (entityManager) => {
      const store = await entityManager.findOneBy(Stores, {
        storeId,
      });
      if (!store) {
        throw new HttpException(`Store doesn't exist`, HttpStatus.NOT_FOUND);
      }
      if (dto.thumbnail) {
        const newFileName: string = uuid();
        const bucket = this.firebaseProvoder.app.storage().bucket();
        if (store.thumbnailFile) {
          try {
            const deleteFile = bucket.file(
              `store/profile/${store.thumbnailFile.fileName}`
            );
            deleteFile.delete();
          } catch (ex) {
            console.log(ex);
          }
          const file = store.thumbnailFile;
          file.fileName = `${newFileName}${extname(dto.thumbnail.fileName)}`;
          file.originalFileName = dto.thumbnail.fileName;

          const bucketFile = bucket.file(
            `store/profile/${newFileName}${extname(file.fileName)}`
          );
          const img = Buffer.from(dto.thumbnail.data, "base64");
          await bucketFile.save(img).then(async () => {
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
            file.url = url[0];
            store.thumbnailFile = await entityManager.save(Files, file);
          });
        } else {
          const file = new Files();
          file.fileName = `${newFileName}${extname(dto.thumbnail.fileName)}`;
          file.originalFileName = dto.thumbnail.originalFileName;

          const bucketFile = bucket.file(
            `store/profile/${newFileName}${extname(file.fileName)}`
          );
          const img = Buffer.from(dto.thumbnail.data, "base64");
          await bucketFile.save(img).then(async () => {
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
            file.url = url[0];
            store.thumbnailFile = await entityManager.save(Files, file);
          });
        }
      }
      return await entityManager.save(Stores, store);
    });
  }

  async removeAttachmentFile(storeDocumentId: string) {
    try {
      return await this.storeRepo.manager.transaction(async (entityManager) => {
        const documents = await entityManager.findOne(StoreDocuments, {
          where: { storeDocumentId },
          relations: ["file", "store"],
        });
        if (documents) {
          await entityManager.delete(StoreDocuments, {
            storeDocumentId,
          });
          const file = documents.file;
          await entityManager.delete(Files, { fileId: file.fileId });

          try {
            const bucket = this.firebaseProvoder.app.storage().bucket();
            const deleteFile = bucket.file(
              `store/files/${documents.file.fileName}`
            );
            deleteFile.delete();
          } catch (ex) {
            console.log(ex);
          }

          const store = documents.store;
          return entityManager.find(StoreDocuments, {
            where: {
              store: { storeId: store.storeId },
            },
            relations: ["file"],
          });
        } else {
          return [];
        }
      });
    } catch (e) {
      throw e;
    }
  }
}
