import DiscuzXRequest from "../../../foundation/HTTP/DiscuzXRequest";

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

class FilesApi extends DiscuzXRequest {
  uploadFile(file: File, body: Record<string, string> = {}, fileName: string = "file") {
    return this.upload<TUploadResult>(null, file, fileName, body).then(res => {
      res.data.link = `${this.requestURL}&uri=files/${res.data.fileId}`;
      res.data.accessURL = `${this.requestURL}/${res.data.accessPath}`;
      return res;
    });
  }
  deleteFile(fileId: string) {
    return this.delete(fileId);
  }
  genFileLink(fileId: string): string {
    return `${this.requestURL}&uri=files/${fileId}`;
  }
}

export default new FilesApi("files");