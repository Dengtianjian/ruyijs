import { reactive, ref } from "vue"
import Request from "../foundation/HTTP/Request";
import SettingsApi from "../api/common/SettingsApi";



export default class <T extends object> {
  loading = ref<boolean>(false);
  saving = ref<boolean>(false);
  disabled = ref<boolean>(false);
  // @ts-ignore
  settings = reactive<T>({});

  load(keys: string[]) {
    this.loading.value = true;
    return SettingsApi.list<T>(keys).then(settings => {
      for (const key in settings.data) {
        // @ts-ignore
        this.settings[key] = settings.data[key];
      }
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