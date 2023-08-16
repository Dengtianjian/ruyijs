import DiscuzXRequest from "../../../foundation/HTTP/DiscuzXRequest";


class SettingsApi extends DiscuzXRequest {
  list<T>(keys: string[]) {
    return this.get<T>("settings/list", {
      keys: keys.join(",")
    });
  }
  saveList(KeyValues: Record<string, any>) {
    return this.patch<number>("settings/list", {
      data: KeyValues
    });
  }
  save(key: string, value: any) {
    return this.patch<number>(`settings/${key}`, {
      value
    });
  }
}

export default new SettingsApi();