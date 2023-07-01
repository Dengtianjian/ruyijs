

export default class MPStore<T extends Record<string | number, any>> {
  #data: any = {};
  #links: Map<keyof T, Map<string, string[]>> = new Map();
  #linkPageIds: Set<string> = new Set();
  constructor(data: T) {
    this.#data = data;
  }
  get(key: keyof T): any {
    return this.#data[key.toString()];
  }
  #getPageId() {
    const Page = getCurrentPages()?.[0];
    if (!Page) return null;
    return Page['_RuyiPageId'].toString();
  }
  set(key: keyof T, value: any, callback?: () => void) {
    const Pages = getCurrentPages();

    this.#data[key.toString()] = value;
    if (this.#links.has(key.toString())) {
      const links = this.#links.get(key.toString());
      Pages.forEach(item => {
        if (item['_RuyiPageId'] && links.has(item['_RuyiPageId'])) {
          links.get(item['_RuyiPageId'].toString()).forEach(AttributeName => {
            item.setData({
              [AttributeName.toString()]: value
            }, callback)
          });
        }
      });
    }
    return this;
  }
  setData(key: keyof T, value: any, callback?: () => void) {
    const Pages = getCurrentPages();

    if (this.#links.has(key.toString())) {
      const links = this.#links.get(key.toString());
      Pages.forEach(item => {
        if (item['_RuyiPageId'] && links.has(item['_RuyiPageId'])) {
          links.get(item['_RuyiPageId'].toString()).forEach(AttributeName => {
            item.setData({
              [AttributeName.toString()]: value
            }, callback)
          });
        }
      });
    }
    return this;
  }
  link(key: string, storeKey: keyof T = null) {
    const PageId = this.#getPageId();

    if (PageId) {
      if (storeKey) {
        if (!this.#links.has(storeKey)) {
          this.#links.set(storeKey.toString(), new Map());
          this.#links.get(storeKey.toString()).set(PageId, []);
        }

        this.#links.get(storeKey.toString()).get(PageId).push(key);
      } else {
        if (!this.#links.has(key)) {
          this.#links.set(key.toString(), new Map());
          this.#links.get(key.toString()).set(PageId, []);
        }

        this.#links.get(key.toString()).get(PageId).push(key);
      }
    }

    return this;
  }
  pageLink(pageId: string) {
    this.#linkPageIds.add(pageId);
    return this;
  }
}