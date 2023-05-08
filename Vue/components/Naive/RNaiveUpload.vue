<template>
  <n-upload list-type="image-card" :file-list="FileList" @change="uploadFile"
    @remove="removeFile" v-bind="$attrs">
    <slot />
  </n-upload>
</template>

<script lang="ts" setup>
import { UploadFileInfo, useMessage } from 'naive-ui';
import { reactive, watch } from 'vue';

const NMessage = useMessage();

const Props = withDefaults(defineProps<{
  files?: Array<UploadFileInfo>,
  file?: UploadFileInfo,
  single?: boolean,
  upload: (file: UploadFileInfo) => Promise<string | UploadFileInfo>
  remove: (file: UploadFileInfo) => Promise<boolean>
}>(), {
  files: null,
  file: null,
  single: false
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
    Props.upload(file).then(res => {
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
  return Props.remove(file).then(_ => {
    FileList.splice(FileList.findIndex(item => {
      return item.id === file.id;
    }), 1);
    if (Props.single) {
      Emits("update:file", null);
    }
    return true;
  }).catch(err => {
    if (err.statusCode === 404) {
      FileList.splice(FileList.findIndex(item => {
        return item.id === file.id;
      }));
      if (Props.single) {
        Emits("update:file", null);
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