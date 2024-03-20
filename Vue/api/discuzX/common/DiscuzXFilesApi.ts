import DiscuzXRequest from "../../../foundation/HTTP/discuzXRequest";

type TUploadResult = {
  accessPath: string,
  extension: string,
  fileId: string,
  fullPath: string,
  height: number,
  path: string,
  relativePath: string,
  saveFileName: string,
  size: number,
  sourceFileName: string,
  width: number,
  link: string,
  accessURL: string,
}

export interface IDiscuzXFileUploadAuth {
  'header-list': string
  'key-time': string
  'sign-algorithm': string
  'sign-time': string
  signature: string
  'url-param-list': string
}
export interface IDiscuzXFileAuthData {
  fileKey: string,
  remoteFileKey: string,
  auth: IDiscuzXFileUploadAuth,
  authString: string,
  previewURL: string,
  accessControl: string,
  httpMethod: 'post' | 'put'
}

export interface IDiscuzXFileInfo {
  key: string,
  name: string,
  size: number,
  width: number,
  height: number,
  url: string,
  previewURL: string,
  downloadURL: string,
}

export class DiscuzXFilesApi extends DiscuzXRequest {
  getUploadAuth(sourceFileName: string, filePath: string, size: number) {
    return this.post<IDiscuzXFileAuthData>("auth/upload", {
      sourceFileName,
      filePath,
      size
    });
  }
  getFileInfo(fileKey: string) {
    return this.get<IDiscuzXFileInfo>(fileKey);
  }
  uploadFile(FileKey: string, file: File, body: Record<string, string> = {}, fileName: string = null) {
    return this.upload<IDiscuzXFileInfo>(FileKey, file, fileName, body);
  }
  deleteFile(fileKey: string) {
    return this.delete(fileKey);
  }
}

export default new DiscuzXFilesApi('files');