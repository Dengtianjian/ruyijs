<template>
  <n-upload list-type="image-card" accept="image/*" :max="max" :file-list="FileList" @change="uploadFile"
    @remove="removeFile" v-bind="$attrs">
    <slot />
  </n-upload>
</template>

<script lang="ts" setup>
import { UploadFileInfo, useMessage } from 'naive-ui';
import { reactive, watch } from 'vue';
import FilesApi from '../../api/common/FilesApi';

const NMessage = useMessage();

const Props = withDefaults(defineProps<{
  files?: Array<UploadFileInfo>,
  file?: UploadFileInfo,
  max?: number,
  single?: boolean
}>(), {
  files: null,
  file: null,
  max: 1,
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
    FilesApi.uploadFile(file.file).then(res => {
      if (Props.single === true || Props.single === undefined) {
        FileList.splice(0, 1, {
          id: res.fileId,
          name: res.sourceFileName,
          status: "finished",
          thumbnailUrl: res.link,
          url: res.link
        });
        Emits("update:file", {
          id: res.fileId,
          name: res.sourceFileName,
          status: "finished",
          thumbnailUrl: res.link,
          url: res.link
        });
      } else {
        FileList.push({
          id: res.fileId,
          name: res.sourceFileName,
          status: "finished",
          thumbnailUrl: res.link,
          url: res.link
        });
        Emits("update:files", FileList);
      }
    }).catch(err => {
      NMessage.error(err.message ?? "上传失败，请稍后重试");
    })
  }
}

function removeFile({ file }: { file: UploadFileInfo }) {
  return FilesApi.deleteFile(file.id).then(res => {
    FileList.splice(FileList.findIndex(item => {
      return item.id === file.id;
    }));
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