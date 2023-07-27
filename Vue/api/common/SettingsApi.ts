import Request from "../../foundation/HTTP/Request";

class SettingsApi extends Request {
  list<T>(keys: string[]) {
    return this.get<T>("list", {
      keys: keys.join(",")
    });
  }
  saveList(KeyValues: Record<string, any>) {
    return this.patch("list", {
      data: KeyValues
    });
  }
  save(key: string, value: any) {
    return this.patch(key, {
      value
    });
  }
}

export default new SettingsApi("settings");