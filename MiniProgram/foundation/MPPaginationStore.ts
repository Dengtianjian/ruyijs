import { IPagination } from "../types/MPHTTPTypes";
import MPStore from "./MPStore";

export default class MPPaginationStore<T> {
  #pageThis: WechatMiniprogram.Page.Instance<any, any> = null;
  #attributeName: string = null;
  #perPage: number = 1;
  #store: MPStore<{ loading: false; finished: false; page: number; perPage: number; total: number; }> = null;
  constructor(attributeName: string, perPage: number = 1) {
    this.#attributeName = attributeName;
    this.#perPage = perPage;
  }
  page(newPage: number = null) {
    if (newPage !== null) {
      this.#store.set("page", newPage);
    }
    return this.#store.get("page");
  }
  perPage(newPerPage: number = null) {
    if (newPerPage !== null) {
      this.#perPage = newPerPage;
      this.#store.set("perPage", newPerPage);
    }
    return this.#perPage;
  }
  total(newTotal: number = null) {
    if (newTotal !== null) {
      this.#store.set("total", newTotal);
    }
    return this.#store.get("total");
  }
  finished(flag: boolean = null) {
    if (flag !== null) {
      this.#store.set("finished", flag);
    }
    return this.#store.get("finished");
  }
  loading(flag: boolean = null) {
    if (flag !== null) {
      this.#store.set("loading", flag);
    }
    return this.#store.get("loading");
  }
  bindPage(pageThis: any) {
    this.#pageThis = pageThis;
    pageThis.setData({
      [`${this.#attributeName}_loading`]: false,
      [`${this.#attributeName}_finished`]: false,
      [`${this.#attributeName}_page`]: 1,
      [`${this.#attributeName}_perPage`]: this.#perPage,
      [`${this.#attributeName}_total`]: 0,
    });

    this.#store = new MPStore({
      loading: false,
      finished: false,
      page: 1,
      perPage: 1,
      total: 0
    });

    this.#store.link(`${this.#attributeName}_loading`, "loading", pageThis.data._RuyiPageId);
    this.#store.link(`${this.#attributeName}_finished`, "finished", pageThis.data._RuyiPageId);
    this.#store.link(`${this.#attributeName}_page`, "page", pageThis.data._RuyiPageId);
    this.#store.link(`${this.#attributeName}_perPage`, "perPage", pageThis.data._RuyiPageId);
    this.#store.link(`${this.#attributeName}_total`, "total", pageThis.data._RuyiPageId);

    return this;
  }
  refresh(): this {
    if (this.loading()) return this;

    this.finished(false);
    this.loading(false);
    this.page(1);
    this.total(0);
    this.#pageThis.setData({
      [this.#attributeName]: []
    });
    return this;
  }
  #loadPromise: Promise<IPagination<T>> = null;
  load(request: Promise<IPagination<T> | any>) {
    if (this.finished()) return this.#loadPromise;

    this.#loadPromise = request.then(data => {
      this.#pageThis.setData({
        [`${this.#attributeName}.${this.page().toString()}`]: data.list
      });
      this.total(data.pagination.total);
      if (data.pagination.items < this.#perPage) {
        this.finished(true);
      }

      this.page(this.page() + 1);

      return data;
    });

    return this.#loadPromise;
  }
}