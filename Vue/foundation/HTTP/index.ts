import helper from "../helper";

export type TMethods = | 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | 'PATCH';

export type TBody = Record<string, any> | BodyInit

type HTTPResponse<ResponseData> = {
  code: number | string,
  message: string,
  data: ResponseData,
  details: any,
  statusCode: number,
  requiredTime: string,
  version: string,
}

export interface IResponse<ResponseData> {
  statusCode: number,
  header: Record<string, string>,
  cookies: string[],
  error: boolean,
  code: number | string,
  message: string,
  data: ResponseData,
  details: any,
  requiredTime: string,
  version: string,
}

export interface IPagination<Data> {
  pagination: {
    page: number,
    perPage: number,
    total: number
  }
  list: Data,
}

export default class HTTP {
  #baseURL: string = null;
  /**
   * 获取基URL
   */
  get requestURL() {
    return this.#baseURL;
  }
  #method: TMethods = "GET";
  /**
   * 获取请求方式
   */
  get requestMethod() {
    return this.#method;
  }
  #query: Record<string, string> = {};
  /**
   * 获取请求查询参数
   */
  get requestQuery() {
    return this.#query;
  }
  #body: TBody = null;
  /**
   * 获取请求体
   */
  get requestBody() {
    return this.#body;
  }
  #pipes: string[] = [];
  /**
   * 获取请求管道
   */
  get requestPipes() {
    return this.#pipes;
  }
  #headers: Record<string, string> = {};
  /**
   * 获取请求头
   */
  get requestHeaders() {
    return this.#headers;
  }
  #options: RequestInit = {};

  /**
   * 构建HTTP实例
   * @param baseURL 基URL
   * @param method 请求方式
   * @param query 查询参数
   * @param body 请求体
   * @param pipes 数据管道
   */
  constructor(baseURL: string = null, method: TMethods = "GET", query: Record<string, number | string | boolean> = {}, body: TBody = null, pipes: string[] = [], options: RequestInit = {}) {
    this.#baseURL = baseURL;
    this.#method = method;
    for (const key in query) {
      let value = query[key];
      if (typeof value === "boolean") {
        value = Number(value);
      }

      this.#query[key] = value.toString();
    }
    this.#body = body;
    this.#pipes = pipes;
    this.#options = options;
  }
  /**
   * 设置请求根地址
   * @param baseURl URL地址
   * @returns HTTP
   */
  url(baseURl: string) {
    this.#baseURL = baseURl;
    return this;
  }
  /**
   * 增加管道
   * @param pipes 管道名称
   * @returns HTTP
   */
  pipes(...pipes: string[]): HTTP {
    this.#pipes.push(...pipes);
    return this;
  }
  /**
   * 设置查询参数
   * @param key 键
   * @param value 值
   * @param allowNull 如果传入的值为null是否继续传
   * @returns HTTP
   */
  query(key: string, value: number | string | boolean, allowNull: boolean = false): this {
    if (value === null && allowNull === false) {
      return this;
    }
    if (typeof value === "boolean") {
      value = Number(value);
    }
    this.#query[key] = value.toString();
    return this;
  }
  /**
   * 设置请求体数据
   * @param data 请求体数据
   * @returns HTTP
   */
  body(data: TBody) {
    this.#body = data;
    return this;
  }
  /**
   * 设置请求头参数
   * @param key 键
   * @param value 值
   * @returns HTTP
   */
  header(key: string, value: string = "") {
    this.#headers[key] = value;
    return this;
  }
  options(key: keyof RequestInit, value: never) {
    this.#options[key] = value;
    return this;
  }
  /**
   * 生成一个URL
   * @param baseURL 基URL
   * @param uri URI
   * @param query 查询参数
   * @returns string
   */
  static genURL(baseURL: string, uri: string | number | (string | number)[], query: Record<string, string | number> = {}): string {
    uri = uri ?? [];
    let queryString: string = "";

    if (baseURL.includes("?")) {
      const uris = baseURL.split("?");
      uris[1].split("&").map(item => item.split("=")).forEach(item => {
        if (!query[item[0]]) {
          query[item[0]] = item[1];
        }
      });
      baseURL = baseURL.substring(0, baseURL.lastIndexOf("?"));
    }

    let queryGroup: string[] = [];
    for (const key in query) {
      queryGroup.push(`${key}=${query[key]}`);
    }
    queryString = queryGroup.join("&");

    if (baseURL[baseURL.length - 1] === "/") {
      baseURL = baseURL.substring(0, baseURL.length - 1);
    }
    uri = Array.isArray(uri) ? uri : [uri];
    uri = uri.map(item => {
      item = item.toString();
      if (item[0] === "/") {
        item = item.substring(1, item.length);
      }
      if (item[item.length - 1] === "/") {
        item = item.substring(0, item.length - 1);
      }

      return item;
    });
    uri = uri.filter(item => item.toString().trim());
    return [baseURL, ...uri].join("/") + `?${queryString}`;
  }
  /**
   * 发送请求
   * @param uri URI
   * @param method 请求方式
   * @returns Promise
   */
  send<ResponseData>(uri: string | number | (string | number)[] = null, method: TMethods = null): Promise<IResponse<ResponseData>> {
    method = method ?? this.#method;

    if (this.#pipes.length) {
      this.query("_pipes", this.#pipes.join(","));
    }

    const Headers = this.#headers;

    const options: RequestInit = Object.assign({
      headers: Headers,
      method: method.toUpperCase(),
      mode: "cors"
    }, this.#options);

    if ((!Headers['content-type'] || !Headers['Content-type']) && helper.type(this.#body) === "object" || Array.isArray(this.#body)) {
      Headers['content-type'] = "application/json";
      this.#body = JSON.stringify(this.#body);
    }

    const URL = HTTP.genURL(this.#baseURL, uri, this.#query);

    if (method !== "GET") {
      // @ts-ignore
      options['body'] = this.#body;
    }

    return new Promise<IResponse<ResponseData>>((resolve, reject) => {
      return fetch(URL, options).then(async res => {
        return {
          response: res,
          text: await res.text()
        }
      }).then(({ response, text }) => {
        const header: Record<string, string> = {};
        response.headers.forEach((val, key) => {
          header[key] = val;
        });

        const Response: IResponse<ResponseData> = {
          code: response.status,
          message: "ok",
          data: null,
          details: null,
          statusCode: response.status,
          header,
          cookies: null,
          version: null,
          requiredTime: null,
          error: response.status > 299
        };

        if (text && (header['Content-Type']?.includes("application/json") || header['content-type']?.includes("application/json"))) {
          const ResponseBody: HTTPResponse<ResponseData> = JSON.parse(text);
          Response['data'] = ResponseBody.data;
          Response.code = ResponseBody.code;
          Response.details = ResponseBody.details;
          Response.message = ResponseBody.message;
          Response.requiredTime = ResponseBody.requiredTime;
          Response.version = ResponseBody.version;
        } else {
          // @ts-ignore
          Response['data'] = text;
        }

        if (Response.error) {
          reject(Response);
        } else {
          resolve(Response);
        }
      }).catch(reject);
    });
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