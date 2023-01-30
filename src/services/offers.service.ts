import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import * as moment from "moment";
import { extname } from "path";
import { CreateOfferDto } from "src/core/dto/offer/offer.create.dto";
import { OfferDto } from "src/core/dto/offer/offer.update.dtos";
import { StoreDto } from "src/core/dto/store/store.update.dtos";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { firebaseConfig } from "src/core/provider/firebase/firestore-config";
import { Files } from "src/shared/entities/Files";
import { Offers } from "src/shared/entities/Offers";
import { OfferTypes } from "src/shared/entities/OfferTypes";
import { StoreDocuments } from "src/shared/entities/StoreDocuments";
import { Stores } from "src/shared/entities/Stores";
import { In, Repository } from "typeorm";
import { v4 as uuid } from "uuid";

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offers)
    private readonly offereRepo: Repository<Offers>,
    private firebaseProvoder: FirebaseProvider
  ) {}
  async getByAdvanceSearchByStore(params: {
    storeId: string;
    status: any;
    dueDate?: any;
    key: string;
    offerTypes: any[];
  }) {
    try {
      const options = params as any;
      options.offerTypes = params.offerTypes.map((x) => {
        return x.toLowerCase();
      });
      options.entityStatusId = 1;
      options.storeId = params.storeId;
      options.key = `%${params.key ? params.key : ""}%`;
      options.dueDate = new Date(
        moment(`${moment(params.dueDate).format("YYYY-MM-DD")} 00:00`).format(
          "YYYY-MM-DD HH:mm"
        )
      );
      if (!isNaN(params.status) && Number(params.status) === 1) {
        return this.getActiveOffersByStore(options);
      } else if (!isNaN(params.status) && Number(params.status) === 2) {
        return this.getOverDueOffersByStore(options);
      } else {
        return this.getAllOffersByStore(options);
      }
    } catch (e) {
      throw e;
    }
  }

  private async getAllOffersByStore(options) {
    try {
      let q = this.offereRepo.manager
        .createQueryBuilder("Offers", "o")
        .leftJoinAndSelect("o.thumbnailFile", "tf")
        .leftJoinAndSelect("o.store", "s")
        .leftJoinAndSelect("s.user", "u")
        .leftJoinAndSelect("o.entityStatus", "es")
        .leftJoinAndSelect("o.offerType", "ot");
      if (options.offerTypes.length > 0) {
        q = q.where(
          "es.entityStatusId = :entityStatusId AND " +
            "s.storeId = :storeId AND " +
            "LOWER(ot.name) IN(:...offerTypes) AND " +
            "(o.name LIKE :key OR o.description LIKE :key OR ot.name LIKE :key)"
        );
      } else {
        q = q.where(
          "es.entityStatusId = :entityStatusId AND " +
            "s.storeId = :storeId AND " +
            "(o.name LIKE :key OR o.description LIKE :key OR ot.name LIKE :key)"
        );
      }
      q.setParameters(options).orderBy("o.due", "ASC");
      return <Offers[]>await q.getMany();
    } catch (e) {
      throw e;
    }
  }

  private async getActiveOffersByStore(options) {
    try {
      let q = this.offereRepo.manager
        .createQueryBuilder("Offers", "o")
        .leftJoinAndSelect("o.thumbnailFile", "tf")
        .leftJoinAndSelect("o.store", "s")
        .leftJoinAndSelect("s.user", "u")
        .leftJoinAndSelect("o.entityStatus", "es")
        .leftJoinAndSelect("o.offerType", "ot");
      if (options.offerTypes.length > 0) {
        q = q.where(
          "o.due >= :dueDate AND " +
            "es.entityStatusId = :entityStatusId AND " +
            "s.storeId = :storeId AND " +
            "LOWER(ot.name) IN(:...offerTypes) AND " +
            "(o.name LIKE :key OR o.description LIKE :key OR ot.name LIKE :key)"
        );
      } else {
        q = q.where(
          "o.due >= :dueDate AND " +
            "es.entityStatusId = :entityStatusId AND " +
            "s.storeId = :storeId AND " +
            "(o.name LIKE :key OR o.description LIKE :key OR ot.name LIKE :key)"
        );
      }
      q.setParameters(options).orderBy("o.due", "ASC");
      return <Offers[]>await q.getMany();
    } catch (e) {
      throw e;
    }
  }

  private async getOverDueOffersByStore(options) {
    try {
      let q = this.offereRepo.manager
        .createQueryBuilder("Offers", "o")
        .leftJoinAndSelect("o.thumbnailFile", "tf")
        .leftJoinAndSelect("o.store", "s")
        .leftJoinAndSelect("s.user", "u")
        .leftJoinAndSelect("o.entityStatus", "es")
        .leftJoinAndSelect("o.offerType", "ot");
      if (options.offerTypes.length > 0) {
        q = q.where(
          "o.due < :dueDate AND " +
            "es.entityStatusId = :entityStatusId AND " +
            "s.storeId = :storeId AND " +
            "LOWER(ot.name) IN(:...offerTypes) AND " +
            "(o.name LIKE :key OR o.description LIKE :key OR ot.name LIKE :key)"
        );
      } else {
        q = q.where(
          "o.due < :dueDate AND " +
            "es.entityStatusId = :entityStatusId AND " +
            "s.storeId = :storeId AND " +
            "(o.name LIKE :key OR o.description LIKE :key OR ot.name LIKE :key)"
        );
      }
      q.setParameters(options).orderBy("o.due", "ASC");
      return <Offers[]>await q.getMany();
    } catch (e) {
      throw e;
    }
  }

  async getByClientAdvanceSearch(params: {
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
      options.entityStatusId = 1;
      options.key = `%${params.key ? params.key : ""}%`;
      options.isApproved = true;
      options.userId = params.userId;
      options.entityStatusId = 1;
      let q = this.offereRepo.manager
        .createQueryBuilder("Offers", "o")
        .leftJoinAndSelect("o.thumbnailFile", "tf")
        .leftJoinAndSelect("o.store", "s")
        .leftJoinAndSelect("s.user", "u")
        .leftJoinAndSelect("o.entityStatus", "oes")
        .leftJoinAndSelect("s.entityStatus", "ses")
        .leftJoinAndSelect("o.offerType", "ot");

      if (options.offerTypes.length > 0) {
        q = q.andWhere(
          "o.due >= :dueDate AND " +
            "u.userId <> :userId AND " +
            "s.isApproved = :isApproved AND " +
            "oes.entityStatusId = :entityStatusId AND " +
            "ses.entityStatusId = :entityStatusId AND " +
            "LOWER(ot.name) IN(:...offerTypes) AND " +
            "(o.name LIKE :key OR o.description LIKE :key OR ot.name LIKE :key)"
        );
      } else {
        q = q.andWhere(
          "o.due >= :dueDate AND " +
            "u.userId <> :userId AND " +
            "s.isApproved = :isApproved AND " +
            "oes.entityStatusId = :entityStatusId AND " +
            "ses.entityStatusId = :entityStatusId AND " +
            "(o.name LIKE :key OR o.description LIKE :key OR ot.name LIKE :key)"
        );
      }
      q.setParameters(options).orderBy("o.due", "ASC");
      return <Offers[]>await q.getMany();
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      const store = await this.offereRepo.findOne({
        where: options,
        relations: {
          entityStatus: true,
          store: {
            user: true,
          },
          offerType: true,
          thumbnailFile: true,
        },
      });
      return store;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(offerId: string) {
    try {
      const offer = await this.findOne({
        offerId,
        entityStatus: { entityStatusId: "1" },
      });
      if (!offer) {
        throw new HttpException("Offer not found", HttpStatus.NOT_FOUND);
      }
      return offer;
    } catch (e) {
      throw e;
    }
  }

  async add(createOfferDto: CreateOfferDto) {
    try {
      return await this.offereRepo.manager.transaction(
        async (entityManager) => {
          const offer = new Offers();
          offer.name = createOfferDto.name;
          offer.description = createOfferDto.description;
          offer.due = createOfferDto.due;
          offer.dealOffer = createOfferDto.dealOffer;
          offer.location = createOfferDto.location;
          offer.offerType = await entityManager.findOneBy(OfferTypes, {
            offerTypeId: createOfferDto.offerTypeId,
          });
          offer.store = await entityManager.findOneBy(Stores, {
            storeId: createOfferDto.storeId,
          });
          if (createOfferDto.thumbnail) {
            const newFileName: string = uuid();

            const file = new Files();
            file.fileName = `${newFileName}${extname(
              createOfferDto.thumbnail.fileName
            )}`;
            file.originalFileName = createOfferDto.thumbnail.fileName;
            const app = initializeApp(firebaseConfig);
            const storeApp = getStorage(app);
            const img = Buffer.from(createOfferDto.thumbnail.data, "base64");
              
            try{
              const imageRef = ref(storeApp, `offer/profile/${newFileName}${extname(file.fileName)}`);
              await uploadBytes(imageRef, img).then(async()=>{
                console.log('hererer')
                file.url = await getDownloadURL(imageRef);
                offer.thumbnailFile = await entityManager.save(Files, file);
                console.log(file.url)
              }).catch((error)=>{
                console.log(error.message);
                throw error;
              });
            }catch(e){
              console.log(e)
            }

            
            // const newFileName: string = uuid();
            // const bucket = this.firebaseProvoder.app.storage().bucket();

            // const file = new Files();
            // file.fileName = `${newFileName}${extname(
            //   createOfferDto.thumbnail.fileName
            // )}`;
            // file.originalFileName = createOfferDto.thumbnail.fileName;

            // const bucketFile = bucket.file(
            //   `offer/profile/${newFileName}${extname(file.fileName)}`
            // );
            // const img = Buffer.from(createOfferDto.thumbnail.data, "base64");
            // await bucketFile.save(img).then(async () => {
            //   const url = await bucketFile.getSignedUrl({
            //     action: "read",
            //     expires: "03-09-2500",
            //   });
            //   file.url = url[0];
            //   offer.thumbnailFile = await entityManager.save(Files, file);
            // });
          }
          return await entityManager.save(Offers,offer);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async update(dto: OfferDto) {
    try {
      return await this.offereRepo.manager.transaction(
        async (entityManager) => {
          const { offerId } = dto;
          const offer = await entityManager.findOne(Offers, {
            where: {
              offerId,
            },
          });
          if (!offer) {
            throw new HttpException("Offer not found", HttpStatus.NOT_FOUND);
          }
          offer.name = dto.name;
          offer.description = dto.description;
          const offerType = await entityManager.findOne(OfferTypes, {
            where: { offerTypeId: dto.offerTypeId },
          });
          if (!offerType) {
            throw new HttpException(
              "OfferType not found",
              HttpStatus.NOT_FOUND
            );
          }
          offer.offerType = offerType;
          offer.due = dto.due;
          offer.dealOffer = dto.dealOffer;
          offer.location = dto.location;

          if (dto.thumbnail) {
            const newFileName: string = uuid();
            const bucket = this.firebaseProvoder.app.storage().bucket();
            if (offer.thumbnailFile) {
              const newFileName: string = uuid();

              const file = new Files();
              file.fileName = `${newFileName}${extname(
                dto.thumbnail.fileName
              )}`;
              file.originalFileName = dto.thumbnail.fileName;
              const app = initializeApp(firebaseConfig);
              const storeApp = getStorage(app);
              const img = Buffer.from(dto.thumbnail.data, "base64");
                
              try{
                const imageRef = ref(storeApp, `offer/profile/${newFileName}${extname(file.fileName)}`);
                await uploadBytes(imageRef, img).then(async()=>{
                  console.log('hererer')
                  file.url = await getDownloadURL(imageRef);
                  offer.thumbnailFile = await entityManager.save(Files, file);
                  console.log(file.url)
                }).catch((error)=>{
                  console.log(error.message);
                  throw error;
                });
              }catch(e){
                console.log(e)
              }
              // try {
              //   const deleteFile = bucket.file(
              //     `offer/profile/${offer.thumbnailFile.fileName}`
              //   );
              //   deleteFile.delete();
              // } catch (ex) {
              //   console.log(ex);
              // }
              // const file = offer.thumbnailFile;
              // file.fileName = `${newFileName}${extname(
              //   dto.thumbnail.fileName
              // )}`;
              // file.originalFileName = dto.thumbnail.fileName;

              // const bucketFile = bucket.file(
              //   `offer/profile/${newFileName}${extname(file.fileName)}`
              // );
              // const img = Buffer.from(dto.thumbnail.data, "base64");
              // await bucketFile.save(img).then(async () => {
              //   const url = await bucketFile.getSignedUrl({
              //     action: "read",
              //     expires: "03-09-2500",
              //   });
              //   file.url = url[0];
              //   offer.thumbnailFile = await entityManager.save(Files, file);
              // });
            } else {
              const newFileName: string = uuid();

              const file = new Files();
              file.fileName = `${newFileName}${extname(
                dto.thumbnail.fileName
              )}`;
              file.originalFileName = dto.thumbnail.fileName;
              const app = initializeApp(firebaseConfig);
              const storeApp = getStorage(app);
              const img = Buffer.from(dto.thumbnail.data, "base64");
                
              try{
                const imageRef = ref(storeApp, `offer/profile/${newFileName}${extname(file.fileName)}`);
                await uploadBytes(imageRef, img).then(async()=>{
                  console.log('hererer')
                  file.url = await getDownloadURL(imageRef);
                  offer.thumbnailFile = await entityManager.save(Files, file);
                  console.log(file.url)
                }).catch((error)=>{
                  console.log(error.message);
                  throw error;
                });
              }catch(e){
                console.log(e)
              }
              // const file = new Files();
              // file.fileName = `${newFileName}${extname(
              //   dto.thumbnail.fileName
              // )}`;
              // file.originalFileName = dto.thumbnail.originalFileName;

              // const bucketFile = bucket.file(
              //   `offer/profile/${newFileName}${extname(file.fileName)}`
              // );
              // const img = Buffer.from(dto.thumbnail.data, "base64");
              // await bucketFile.save(img).then(async () => {
              //   const url = await bucketFile.getSignedUrl({
              //     action: "read",
              //     expires: "03-09-2500",
              //   });
              //   file.url = url[0];
              //   offer.thumbnailFile = await entityManager.save(Files, file);
              // });
            }
          }
          return await entityManager.save(offer);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async delete(offerId: string) {
    try {
      const store = await this.findOne({
        offerId,
        entityStatus: { entityStatusId: "1" },
      });
      if (!store) {
        throw new HttpException("Offer not found", HttpStatus.NOT_FOUND);
      }
      store.entityStatus.entityStatusId = "2";
      return await this.offereRepo.save(store);
    } catch (e) {
      throw e;
    }
  }
}
