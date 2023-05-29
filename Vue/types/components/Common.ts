import { AllowedComponentProps, ComponentCustomProps, VNodeProps, VNode, RendererNode, RendererElement } from "vue";
import { RouterLinkProps } from "vue-router";

export type RTMenuOption = {
  link?: string | AllowedComponentProps & ComponentCustomProps & VNodeProps & RouterLinkProps,
  key: string,
  label?: string,
  children?: RTMenuOption[],
  type?: string
}