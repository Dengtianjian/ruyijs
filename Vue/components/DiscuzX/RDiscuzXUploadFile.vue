<template>
  <RNaiveUpload :upload="uploadPostAttachment" :remove="removePostAttachment" />
</template>

<script lang="ts" setup>
import RNaiveUpload from '../Naive/RNaiveUpload.vue';
import { UploadFileInfo } from 'naive-ui';
import config from '../../../../config';
import DiscuzXFilesApi from '../../api/discuzX/common/DiscuzXFilesApi';

DiscuzXFilesApi.url(config.APIURL);

function uploadPostAttachment(file: UploadFileInfo): Promise<UploadFileInfo> {
  return DiscuzXFilesApi.uploadFile(file.file).then(res => {
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