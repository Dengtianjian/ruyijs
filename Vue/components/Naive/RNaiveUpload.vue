<template>
  <n-upload :list-type="listType" @change="uploadFile" @remove="removeFile" v-bind="$attrs">
    <slot />
  </n-upload>
</template>

<script lang="ts" setup>
import { UploadFileInfo, useMessage } from 'naive-ui';
import { reactive, ref, watch } from 'vue';

const NMessage = useMessage();

const Props = withDefaults(defineProps<{
  files?: Array<UploadFileInfo>,
  file?: UploadFileInfo,
  single?: boolean,
  uploadFile: (file: UploadFileInfo) => Promise<string | UploadFileInfo>
  removeFile?: (file: UploadFileInfo) => Promise<boolean>,
  max?: number
  listType?: "text" | "image" | "image-card"
}>(), {
  files: null,
  file: null,
  single: false,
  max: 1,
  listType: "text"
});

const Max = ref<number>(1);
watch(() => Props.max, newV => {
  if (Props.single) {
    Max.value = 1;
  } else {
    Max.value = newV;
  }
});
watch(() => Props.single, newV => {
  if (newV) {
    Max.value = 1;
  } else {
    Max.value = Props.max;
  }
});

const FileList = reactive([]);
if (Props.files) {
  FileList.push(...Props.files);
} else if (Props.file) {
  FileList.push(Props.file);
}

const Emits = defineEmits(["update:file", "update:files"]);

function uploadFile({ file }: { file: UploadFileInfo, fileList: Array<UploadFileInfo>, event?: Event }) {
  if (file.file) {
    Props.uploadFile(file).then(res => {
      if (typeof res === "string") {
        if (Props.single === true || Props.single === undefined) {
          FileList.splice(0, 1, {
            id: file.id,
            name: file.name,
            status: "finished",
            url: res
          });
          Emits("update:file", FileList[0]);
        } else {
          FileList.push({
            id: file.id,
            name: file.name,
            status: "finished",
            url: res
          });
          Emits("update:files", FileList);
        }
      } else {
        if (Props.single === true || Props.single === undefined) {
          FileList.splice(0, 1, res);
          Emits("update:file", res);
        } else {
          FileList.push(res);
          Emits("update:files", FileList);
        }
      }
    }).catch(err => {
      NMessage.error(err.message ?? "上传失败，请稍后重试");
    })
  }
}

function removeFile({ file }: { file: UploadFileInfo }) {
  return Props.removeFile(file).then(_ => {
    FileList.splice(FileList.findIndex(item => {
      return item.id === file.id;
    }), 1);
    if (Props.single) {
      Emits("update:file", null);
    } else {
      Emits("update:files", FileList);
    }
    return true;
  }).catch(err => {
    if (err.statusCode === 404) {
      FileList.splice(FileList.findIndex(item => {
        return item.id === file.id;
      }), 1);
      if (Props.single) {
        Emits("update:file", null);
      } else {
        Emits("update:files", FileList);
      }
      return true;
    }
    NMessage.error(err.message ?? "删除失败，请稍后重试");
    return false;
  });
}

watch(() => Props.file, newV => {
  FileList.splice(0);
  if (newV) {
    FileList.push(Props.file);
  }
});
</script>

<style scoped></style>