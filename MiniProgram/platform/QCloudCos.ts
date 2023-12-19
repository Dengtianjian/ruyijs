import { ICOS, TCosGetAuthorizationOptions, TCosGetAuthorizationCallback, TCosACL, TCosHeaders, TCosQuery } from "../types/QCloudCosTypes";

const COS = require('cos-wx-sdk-v5');

export class QCloudCos {
  /**
   * 存储桶名称
   */
  #Bucket: string = null;
  /**
   * 存储桶所在地域
   */
  #Region: string = null;

  /**
   * COS SDK实例
   */
  #CosClient: ICOS = null;
  /**
   * 对象授权信息
   */
  #ObjectAuthorization: Map<string, string> = new Map();
  /**
   * 操作完成后需要移除授权信息的对象键名集
   */
  #RemoveAfterUsingObject: Set<string> = new Set();
  /**
   * 实例化腾讯云COS
   * @param Region 存储桶所在地域
   * @param Bucket 存储桶名称
   */
  constructor(Region: string, Bucket: string) {
    this.#Bucket = Bucket;
    this.#Region = Region;

    this.#CosClient = new COS({
      SimpleUploadMethod: "putObject",
      getAuthorization: (options: TCosGetAuthorizationOptions, callback: TCosGetAuthorizationCallback) => {
        callback(this.#ObjectAuthorization.get(options.Key));
      }
    });
  }
  /**
   * 设置对象授权信息。每次对象操作时都需要用到不同的授权信息，例如上传对象、删除对象、获取对象等。该方法用于在这些操作前调用接口获取到授权信息后传入该方法对应的参数中，以便继续操作后使用授权信息
   * @param objectKey string 对象键名
   * @param auth string 操作对象的授权信息
   * @param removeAfterUsing boolean 操作后移除对象授权信息
   * @returns this
   */
  objectAuthorization(objectKey: string, auth: string, removeAfterUsing: boolean = true) {
    this.#ObjectAuthorization.set(objectKey, auth);
    removeAfterUsing && this.#RemoveAfterUsingObject.add(objectKey);
    return this;
  }
  /**
   * 上传文件
   * @param objectKey string 对象键名
   * @param UploadFilePath string 上传的文件所在路径
   * @param FileSize number 上传的文件尺寸
   * @param ACL string 对象访问控制
   * @returns Promise<string> 对象访问地址
   */
  uploadFile(objectKey: string, UploadFilePath: string, FileSize: number, ACL: TCosACL = null) {
    return new Promise((resolve, reject) => {
      const Headers: TCosHeaders = {};

      if (ACL) {
        Headers['x-cos-acl'] = ACL;
      }

      this.#CosClient.uploadFile({
        Bucket: this.#Bucket,
        Region: this.#Region,
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
        if (this.#RemoveAfterUsingObject.has(objectKey)) {
          this.#RemoveAfterUsingObject.delete(objectKey);
          this.#ObjectAuthorization.delete(objectKey);
        }
      });
    });
  }
  /**
   * 获取对象访问 URL
   * @param Key string 对象键名
   * @param Query object 签名中要签入的请求参数，{key: 'val'} 的格式
   * @param Expires number Url中的签名几秒后失效，默认为 900 秒
   * @returns string 计算得到的 Url
   */
  getObjectURL(Key: string, Query: TCosQuery = {}, Expires: number = null) {
    return new Promise((resolve, reject) => {
      this.#CosClient.getObjectUrl({
        Bucket: this.#Bucket,
        Region: this.#Region,
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