import { UnwrapNestedRefs, reactive, ref, toRaw } from "vue"
import SettingsApi from "../api/common/SettingsApi";

export default class <T extends object> {
  loading = ref<boolean>(false);
  saving = ref<boolean>(false);
  disabled = ref<boolean>(false);
  // @ts-ignore
  settings = reactive<T>({});

  load(keys: string[]): Promise<T> {
    this.loading.value = true;
    // @ts-ignore
    return SettingsApi.list<T>(keys).then(settings => {
      for (const key in settings.data) {
        // @ts-ignore
        this.settings[key] = settings.data[key];
      }
      return settings;
    }).finally(() => {
      this.loading.value = false;
    });
  }
  save(dataHandle: (data?: UnwrapNestedRefs<T>) => T) {
    this.saving.value = true;
    this.disabled.value = true;
    return SettingsApi.saveList(dataHandle ? dataHandle(toRaw(this.settings)) : this.settings).finally(() => {
      this.saving.value = false;
      this.disabled.value = false;
    });
  }
}