<template>
  <n-layout has-sider style="background-color:transparent;">
    <n-layout-sider style="min-height:calc(100vh - 60px);">
      <router-menu :options="menuOptions"></router-menu>
    </n-layout-sider>
    <n-layout-content style="background-color:transparent;">
      <panel>
        <KeepAliveRouterView />
      </panel>
      <CommonFooter />
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts" setup>
import { NLayout, NLayoutSider, NLayoutContent } from 'naive-ui';
import { AllowedComponentProps, ComponentCustomProps, VNodeProps, VNode, RendererNode, RendererElement } from 'vue';
import { RouterLinkProps, RouterView } from 'vue-router';
import CommonFooter from '../CommonFooter.vue';
import KeepAliveRouterView from '../KeepAliveRouterView.vue';

defineProps<{
  menuOptions: Array<{
    link?: string | AllowedComponentProps & ComponentCustomProps & VNodeProps & RouterLinkProps,
    label?: string | (() => VNode<RendererNode, RendererElement, { [key: string]: any; }>) | AllowedComponentProps & ComponentCustomProps & VNodeProps & RouterLinkProps,
    key: string,
  }>
}>();
</script>

<style scoped></style>