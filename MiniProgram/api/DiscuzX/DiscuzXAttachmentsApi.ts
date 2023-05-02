import DiscuzXRequest from "../../foundation/HTTP/DiscuzXRequest";

export type TDiscuzXAttachment = {
  aid: number,
  downloadLink: string,
  fileName: string,
  height: number,
  width: number,
  isImage: boolean,
  size: number,
  thumbURL: string
};

export class DiscuzXAttachmentsApi extends DiscuzXRequest {
  /**
* 上传文件
* @param tempFilePath 上传的文件路径
* @param fileName FormData的键名
* @param body 请求体，会添加到FormData里
* @param task 上传任务，可以用于监听上传进度等
* @param timeout 请求超时
* @returns Promise
*/
  uploadAttachment(tempFilePath: string, fileName?: string, body?: Record<string, string | number>, task?: (task: WechatMiniprogram.UploadTask) => void, timeout?: number): Promise<TDiscuzXAttachment> {
    return super.upload<TDiscuzXAttachment>("attachments", tempFilePath, fileName, body, task, timeout);
  }
}

export default new DiscuzXAttachmentsApi();