import { reactive, ref } from "vue"
import { DiscuzXSettingsApi } from "../../api/discuzX/common/DiscuzXSettingsApi";
import SettingFormService from "../SettingFormService";

export default class <T extends Record<string, any>> extends SettingFormService<T> {
  #apiInstance: DiscuzXSettingsApi = null;
  constructor(apiReuqestBaseURL: string, defaultValue: T) {
    super(defaultValue);
    this.#apiInstance = new DiscuzXSettingsApi("settings", apiReuqestBaseURL);
  }
  load() {
    this.loading.value = true;
    return this.#apiInstance.list<T>(Object.keys(this.settings)).then(settings => {

      for (const key in settings) {
        // @ts-ignore
        this.settings[key] = settings[key];
      }
      return settings;
    }).finally(() => {
      this.loading.value = false;
    });
  }
  save() {
    this.saving.value = true;
    this.disabled.value = true;
    return this.#apiInstance.saveList(this.settings).finally(() => {
      this.saving.value = false;
      this.disabled.value = false;
    });
  }
}