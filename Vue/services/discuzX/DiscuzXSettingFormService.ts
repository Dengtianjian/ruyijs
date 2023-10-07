import { UnwrapNestedRefs, reactive, ref } from "vue"
import DiscuzXSettingsApi from "../../api/discuzX/common/DiscuzXSettingsApi";
import SettingFormService from "../SettingFormService";

export default class <T extends Record<string, any>> extends SettingFormService<T> {

  load(keys: string[]): Promise<T> {
    this.loading.value = true;
    return DiscuzXSettingsApi.list<T>(keys).then(settings => {
      for (const key in settings) {
        // @ts-ignore
        this.settings[key] = settings[key];
      }
      return settings;
    }).finally(() => {
      this.loading.value = false;
    });
  }

  save(dataHandle: (data?: UnwrapNestedRefs<T>) => T): Promise<any> {
    this.saving.value = true;
    this.disabled.value = true;
    return DiscuzXSettingsApi.saveList(dataHandle ? dataHandle(this.settings) : this.settings).finally(() => {
      this.saving.value = false;
      this.disabled.value = false;
    });
  }
}