export default class {
  #data: any = {};
  #links: Map<string, string> = new Map();
  #linkPageIds: Set<string> = new Set();
  constructor(data: Record<string | number, any> = {}) {
    this.#data = data;
  }
  get<T>(key: string | Symbol | number): T {
    return this.#data[key.toString()];
  }
  set(key: string | Symbol | number, value: any, callback?: () => void) {
    this.#data[key.toString()] = value;
    if (this.#links.has(key.toString())) {
      const Page = getCurrentPages()?.[0];

      if (Page) {
        if (this.#linkPageIds.has(Page['_RuyiPageId'].toString())) {
          Page.setData({
            [key.toString()]: value
          }, callback)
        }
      }
    }
    return this;
  }
  setData(key: string | Symbol | number, value: any, callback?: () => void) {
    if (!this.#links.has(key.toString())) {
      const Page = getCurrentPages()?.[0];
      if (Page) {
        if (this.#linkPageIds.has(Page['_RuyiPageId'].toString())) {
          this.#links.set(key.toString(), key.toString());
        }
      }
    }
    return this.set(key, value, callback);
  }
  link(key: string, storeKey: string | Symbol | number = null) {
    if (storeKey) {
      this.#links.set(storeKey.toString(), key);
    } else {
      this.#links.set(key.toString(), key);
    }

    return this;
  }
  pageLink(pageId: string) {
    this.#linkPageIds.add(pageId);
    return this;
  }
}