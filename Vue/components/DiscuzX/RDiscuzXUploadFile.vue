<template>
  <RNaiveUpload :upload-file="uploadPostAttachment" :remove-file="removePostAttachment" />
</template>

<script lang="ts" setup>
import RNaiveUpload from '../Naive/RNaiveUpload.vue';
import { UploadFileInfo } from 'naive-ui';
import DiscuzXFilesApi from '../../api/discuzX/common/DiscuzXFilesApi';

const Props = defineProps<{
  action: string,
  auth?: boolean
}>();

DiscuzXFilesApi.url(Props.action);

function uploadPostAttachment(file: UploadFileInfo): Promise<UploadFileInfo> {
  return DiscuzXFilesApi.query("auth", Props.auth === undefined ? true : Props.auth).uploadFile(file.file).then(res => {
    return {
      id: res.fileId,
      name: res.sourceFileName,
      status: "finished",
      url: res.link
    };
  });
}

function removePostAttachment(file: UploadFileInfo) {
  return DiscuzXFilesApi.deleteFile(file.id).then(_ => {
    return true;
  });
}
</script>

<style scoped></style>