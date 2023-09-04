<template>
  <n-layout has-sider style="background-color:transparent;">
    <n-layout-sider style="min-height:calc(100vh - 60px);">
      <RRouterMenu :options="menuOptions"></RRouterMenu>
    </n-layout-sider>
    <n-layout-content style="background-color:transparent;">
      <RPanel style="margin:20px;">
        <KeepAliveRouterView />
      </RPanel>
      <CommonFooter />
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts" setup>
import { NLayout, NLayoutSider, NLayoutContent } from 'naive-ui';
import { RTMenuOption } from '../../../types/components/Common';
import CommonFooter from '../RCommonFooter.vue';
import KeepAliveRouterView from '../RKeepAliveRouterView.vue';
import RRouterMenu from '../RRouterMenu.vue';
import RPanel from '../RPanel.vue';

defineProps<{
  menuOptions: Array<RTMenuOption>
}>();
</script>

<style scoped></style>