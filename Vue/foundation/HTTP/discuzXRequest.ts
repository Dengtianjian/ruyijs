import { TMethods } from ".";
import Request from "./Request";

export default class extends Request {
  send<ResponseData>(uri: string | number | (string | number)[] = null, method: TMethods = null): Promise<ResponseData> {
    uri = Array.isArray(uri) ? uri.join("/") : uri.toString();
    this.query("uri", uri);

    return super.send<ResponseData>(null, method);
  }
  /**
   * 发送GET请求
   * @param uri URI
   * @returns Promise
   */
  get<ResponseData>(uri: string | string[]) {
    return this.send<ResponseData>(uri, "GET");
  }
  /**
   * 发送POST请求
   * @param uri URI
   * @returns Promise
   */
  post<ResponseData>(uri: string | string[]) {
    return this.send<ResponseData>(uri, "POST");
  }
  /**
   * 发送PUT请求
   * @param uri URI
   * @returns Promise
   */
  put<ResponseData>(uri: string | string[]) {
    return this.send<ResponseData>(uri, "PUT");
  }
  /**
   * 发送delete请求
   * @param uri URI
   * @returns Promise
   */
  delete<ResponseData>(uri: string | string[]) {
    return this.send<ResponseData>(uri, "DELETE");
  }
  /**
   * 发送patch请求
   * @param uri URI
   * @returns Promise
   */
  patch<ResponseData>(uri: string | string[]) {
    return this.send<ResponseData>(uri, "PATCH");
  }
}