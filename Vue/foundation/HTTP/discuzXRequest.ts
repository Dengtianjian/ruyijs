import { TBody, TMethods } from ".";
import Request from "./request";

export default class extends Request {
  send<ResponseData>(uri: string | number | (string | number)[] = null, method: TMethods = null): Promise<ResponseData> {

    let URIs = [];
    if (uri) {
      if (Array.isArray(uri)) {
        URIs.push(...uri);
      } else {
        URIs.push(uri);
      }

      if (this.requestPrefix) {
        if (Array.isArray(this.requestPrefix)) {
          URIs.unshift(...this.requestPrefix);
        } else {
          URIs.unshift(this.requestPrefix);
        }
      }
    }
    uri = Array.isArray(uri) ? uri.join("/") : uri.toString();

    this.query("uri", URIs ? URIs.join("/") : "/");

    return super.send<ResponseData>(null, method);
  }
  /**
   * 发送GET请求
   * @param uri URI
   * @returns Promise
   */
  get<ResponseData>(uri: string | string[], query: Record<string, number | string> = null) {
    if (query) {
      for (const key in query) {
        this.query(key, query[key]);
      }
    }
    return this.send<ResponseData>(uri, "GET");
  }
  /**
   * 发送POST请求
   * @param uri URI
   * @returns Promise
   */
  post<ResponseData>(uri: string | string[], bodyData: TBody = null) {
    if (bodyData) {
      this.body(bodyData);
    }
    return this.send<ResponseData>(uri, "POST");
  }
  /**
   * 发送PUT请求
   * @param uri URI
   * @returns Promise
   */
  put<ResponseData>(uri: string | string[], bodyData: TBody = null) {
    if (bodyData) {
      this.body(bodyData);
    }
    return this.send<ResponseData>(uri, "PUT");
  }
  /**
   * 发送delete请求
   * @param uri URI
   * @returns Promise
   */
  delete<ResponseData>(uri: string | string[], bodyData: TBody = null) {
    if (bodyData) {
      this.body(bodyData);
    }
    return this.send<ResponseData>(uri, "DELETE");
  }
  /**
   * 发送patch请求
   * @param uri URI
   * @returns Promise
   */
  patch<ResponseData>(uri: string | string[], bodyData: TBody = null) {
    if (bodyData) {
      this.body(bodyData);
    }
    return this.send<ResponseData>(uri, "PATCH");
  }
}