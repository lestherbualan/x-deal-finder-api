import { Injectable } from "@nestjs/common";
import admin from "firebase-admin";
import firebaseConfig from "./firebase.config";
import { ConfigService } from "@nestjs/config";
import { applicationDefault } from "firebase-admin/app";

@Injectable()
export class FirebaseProvider {
  public app: admin.app.App;
  constructor(private readonly config: ConfigService) {
    console.log(firebaseConfig)
    this.app = admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: this.config.get<string>("FIREBASE_BUCKET"),
      projectId: firebaseConfig.projectId
    });
  }
}
