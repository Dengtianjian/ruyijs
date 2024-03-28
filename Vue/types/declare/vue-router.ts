import { VNode, VNodeChild } from 'vue';

export type TNaiveMenuRouteMetaMenuOption = {
  index?: number,
  disabled?: boolean,
  extra?: string | (() => VNodeChild),
  icon?: () => VNode,
  label?: string | (() => VNodeChild),
  show?: boolean,
  type?: "group" | "list",
  level?: number
}