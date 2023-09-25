import { UnwrapNestedRefs, reactive, ref } from "vue"
import SettingsApi from "../api/common/SettingsApi";


export default class <T extends object> {
  loading = ref<boolean>(false);
  saving = ref<boolean>(false);
  disabled = ref<boolean>(false);
  // @ts-ignore
  settings = reactive<T>({});
  constructor(defaultValues: T) {
    if (defaultValues) {
      this.settings = reactive(defaultValues);
    }
  }

  load() {
    this.loading.value = true;
    return SettingsApi.list<T>(Object.keys(this.settings)).then(settings => {
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
    return SettingsApi.saveList(this.settings).finally(() => {
      this.saving.value = false;
      this.disabled.value = false;
    });
  }
}