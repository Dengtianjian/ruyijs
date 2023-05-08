import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";

export default {
  init() {
    dayjs.locale("zh-cn");
    dayjs.extend(relativeTime);
  }
}