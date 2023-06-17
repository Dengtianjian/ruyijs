import { AllowedComponentProps, ComponentCustomProps, VNodeProps, VNode, RendererNode, RendererElement, VNodeChild } from "vue";
import { RouterLinkProps } from "vue-router";

export type RTMenuOption = {
  link?: string | AllowedComponentProps & ComponentCustomProps & VNodeProps & RouterLinkProps,
  label?: string | (() => VNode<RendererNode, RendererElement, { [key: string]: any; }>) | AllowedComponentProps & ComponentCustomProps & VNodeProps & RouterLinkProps,
  childrenNames?: string[],
  key: string,
  index: number,
  children?: Array<RTMenuOption>

  disabled?: boolean,
  extra?: string | (() => VNodeChild),
  icon?: () => VNode,
  show?: boolean,
  type?: "group",
  level?: number
}