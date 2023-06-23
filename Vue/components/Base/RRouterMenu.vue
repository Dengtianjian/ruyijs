<template>
  <n-menu :options="menuOptions" v-model:value="DefaultSelectedMenu" v-bind="$attrs" />
</template>

<script lang="ts" setup>
import { MenuOption } from 'naive-ui';
import { AllowedComponentProps, ComponentCustomProps, computed, ComputedRef, PropType, Ref, ref, VNodeProps } from 'vue';
import { useRouter, useRoute, RouterLinkProps } from 'vue-router';
import helper from '../../foundation/helper';
import naiveUIService from '../../services/naiveUIService';
import { RTMenuOption } from '../../types/components/Common';

const Props = defineProps({
  options: {
    type: Array as PropType<Array<RTMenuOption>>
  },
});

const Router = useRouter();
const Route = useRoute();

const DefaultSelectedMenu = ref<string>(Route.name.toString());
Router.beforeResolve((to, from, next) => {
  DefaultSelectedMenu.value = to.name?.toString();
  next();
});

function transform(menus: RTMenuOption[]): MenuOption[] {
  return menus.map(optionItem => {
    if (optionItem.type === "group" && optionItem.children) {
      // @ts-ignore
      optionItem.children = transform(optionItem.children);
      return optionItem;
    }
    if (helper.type(optionItem.link) === "string") {
      return {
        label: typeof optionItem.label === "string" ? naiveUIService.createdRouterLinkLabel(optionItem.label, {
          to: optionItem.link
        }) : optionItem.label,
        key: optionItem.key
      }
    } else {
      return optionItem;
    }
  });
}

const menuOptions: ComputedRef<MenuOption[]> = computed(() => {
  return transform(Props.options);
});

</script>

<style scoped></style>