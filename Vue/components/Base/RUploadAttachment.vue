<template>
  <NaiveUpload :upload="uploadPostAttachment" :remove="removePostAttachment" />
</template>

<script lang="ts" setup>
import NaiveUpload from './Naive/NaiveUpload.vue';
import { UploadFileInfo } from 'naive-ui';
import AttachmentsApi from '../../api/common/AttachmentsApi';
import config from '../../../../config';

function uploadPostAttachment(file: UploadFileInfo): Promise<UploadFileInfo> {
  return AttachmentsApi.uploadAttachment(file.file).then(res => {
    return {
      id: res.aid.toString(),
      name: res.fileName,
      status: "finished",
      url: `${config.URL}/${res.thumbURL}`
    };
  });
}

function removePostAttachment(file: UploadFileInfo) {
  return AttachmentsApi.deleteAttachment(file.id).then(_ => {
    return true;
  });
}
</script>

<style scoped></style>