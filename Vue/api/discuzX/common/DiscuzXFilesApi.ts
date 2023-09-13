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

class DiscuzXFilesApi extends DiscuzXRequest {
  uploadFile(file: File, body: Record<string, string> = {}, fileName: string = "file"): Promise<TUploadResult> {
    return this.upload<TUploadResult>("files", file, fileName, body).then(res => {
      res.link = `${this.requestURL}&uri=files/${res.fileId}`;
      res.accessURL = `${this.requestURL}/${res.accessPath}`;
      return res;
    });
  }
  deleteFile(fileId: string) {
    return this.delete(`files/${fileId}`);
  }
  genFileLink(fileId: string): string {
    return `${this.requestURL}&uri=files/${fileId}`;
  }
}

export default new DiscuzXFilesApi();