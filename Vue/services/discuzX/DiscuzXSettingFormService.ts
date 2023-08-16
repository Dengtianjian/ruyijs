import { reactive, ref } from "vue"
import DiscuzXSettingsApi from "../../api/discuzX/common/DiscuzXSettingsApi";
import SettingFormService from "../SettingFormService";

export default class <T extends Record<string, any>> extends SettingFormService<T> {

  load(keys: string[]) {
    this.loading.value = true;
    return DiscuzXSettingsApi.list<T>(keys).then(settings => {
      for (const key in settings) {
        // @ts-ignore
        this.settings[key] = settings[key];
      }
    }).finally(() => {
      this.loading.value = false;
    });
  }
  // @ts-ignore
  save() {
    this.saving.value = true;
    this.disabled.value = true;
    return DiscuzXSettingsApi.saveList(this.settings).finally(() => {
      this.saving.value = false;
      this.disabled.value = false;
    });
  }
}