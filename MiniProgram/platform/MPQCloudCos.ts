import { TOSSHeaders, TOSSQuery } from "../types/MPOSSTypes";
import { ICOS, TCosGetAuthorizationOptions, TCosGetAuthorizationCallback, TCosACL } from "../types/MPQCloudCosTypes";
import { MPOSS } from "./MPOSS";

const COS = require('cos-wx-sdk-v5');

export class MPQCloudCos extends MPOSS<ICOS> {

  constructor(Region: string, Bucket: string) {
    super(Region, Bucket);

    this.OSSClient = new COS({
      SimpleUploadMethod: "putObject",
      getAuthorization: (options: TCosGetAuthorizationOptions, callback: TCosGetAuthorizationCallback) => {
        callback(this.ObjectAuthorization.get(options.Key));
      }
    });
  }

  uploadFile(objectKey: string, UploadFilePath: string, FileSize: number, ACL: TCosACL = null): Promise<string> {
    return new Promise((resolve, reject) => {
      const Headers: TOSSHeaders = {};

      if (ACL) {
        Headers['x-cos-acl'] = ACL;
      }

      this.OSSClient.uploadFile({
        Bucket: this.Bucket,
        Region: this.Region,
        Key: objectKey,
        FilePath: UploadFilePath,
        FileSize,
        Headers
      }, (err, data) => {
        if (err) {
          reject(err.error);
        } else {
          resolve(data.Location);
        }
        if (this.RemoveAfterUsingObject.has(objectKey)) {
          this.RemoveAfterUsingObject.delete(objectKey);
          this.ObjectAuthorization.delete(objectKey);
        }
      });
    });
  }

  getObjectURL(Key: string, Query: TOSSQuery = {}, Expires: number = null): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.OSSClient.getObjectUrl({
        Bucket: this.Bucket,
        Region: this.Region,
        Key,
        Expires,
        Query
      }, (err, data) => {
        if (err) {
          reject(err);
        } {
          resolve(data.Url);
        }
      });
    });
  }
}