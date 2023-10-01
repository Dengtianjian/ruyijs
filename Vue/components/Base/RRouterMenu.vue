<template>
  <n-menu :options="menuOptions" v-model:value="DefaultSelectedMenu" v-bind="$attrs" />
</template>

<script lang="ts" setup>
import { computed, PropType, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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
  getActiveMenuName(to.name.toString());
  next();
});

function getActiveMenuName(RouteName: string = Route.name.toString()) {
  const HitMenu = menuOptions.value.find(item => {
    if (item.key.toString() === RouteName) return item;
    if (item.childrenNames && item.childrenNames.includes(RouteName)) return item;
    return false;
  });
  DefaultSelectedMenu.value = HitMenu ? HitMenu.key.toString() : RouteName;
}

function transform(menus: RTMenuOption[]): RTMenuOption[] {
  return menus.map(optionItem => {
    if (optionItem.type === "group" && optionItem.children) {
      optionItem.children = transform(optionItem.children);
      return optionItem;
    }
    if (helper.type(optionItem.link) === "string") {
      return {
        label: typeof optionItem.label === "string" ? naiveUIService.createdRouterLinkLabel(optionItem.label, {
          to: optionItem.link
        }) : optionItem.label,
        key: optionItem.key
      } as RTMenuOption;
    } else {
      return optionItem;
    }
  });
}

const menuOptions = computed<RTMenuOption[]>(() => {
  return transform(Props.options);
});
getActiveMenuName();

</script>

<style scoped></style>