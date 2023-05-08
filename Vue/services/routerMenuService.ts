import { AllowedComponentProps, ComponentCustomProps, VNodeProps, VNode, RendererNode, RendererElement } from "vue";
import { RouterLinkProps, RouteRecordRaw, RouteRecordName } from "vue-router";
import NaiveUI from "../foundation/naiveUI";

export type TMenuOption = {
  link?: string | AllowedComponentProps & ComponentCustomProps & VNodeProps & RouterLinkProps,
  label?: string | (() => VNode<RendererNode, RendererElement, { [key: string]: any; }>) | AllowedComponentProps & ComponentCustomProps & VNodeProps & RouterLinkProps,
  childrenNames?: string[],
  key: string,
  index: number
}

function getChildrenRouteNames(Routes: RouteRecordRaw[]): string[] {
  const Names: string[] = [];

  Routes.forEach(RouteItem => {
    Names.push(RouteItem.name.toString());
    if (RouteItem.children) {
      Names.push(...getChildrenRouteNames(RouteItem.children));
    }
  })

  return Names;
}
function getRoute(Routes: RouteRecordRaw[], name: RouteRecordName): RouteRecordRaw[] {
  let routes: RouteRecordRaw[] = [];

  for (let index = 0; index < Routes.length; index++) {
    const Route = Routes[index];
    if (Route.name === name) {
      routes = Route.children;
      break;
    }
    if (Route.children) {
      routes = getRoute(Route.children, name);
    }
  }

  return routes;
}
export function generateRouterMenuOptions(Routes: RouteRecordRaw[]): Array<TMenuOption> {
  const MenuRoutes: Array<TMenuOption> = [];
  Routes.forEach(RouteItem => {
    if (RouteItem.meta?.menu) {
      MenuRoutes.push({
        label: NaiveUI.createdRouterLinkLabel(RouteItem.meta.menuLabel ?? RouteItem.meta.title, {
          to: {
            name: RouteItem.name
          }
        }),
        key: RouteItem.name.toString(),
        childrenNames: getChildrenRouteNames(RouteItem.children ?? []),
        index: RouteItem.meta.menuIndex ?? MenuRoutes.length + 1
      });
    }
    if (RouteItem.children) {
      MenuRoutes.push(...generateRouterMenuOptions(RouteItem.children));
    }
  });
  MenuRoutes.sort((a, b) => {
    return a.index - b.index;
  });
  return MenuRoutes;
}

export function generateSideRouterMenuOptions(Routes: RouteRecordRaw[], RouteName: string = null): Array<TMenuOption> {
  if (RouteName) {
    Routes = getRoute(Routes, RouteName);
    if (!Routes) return [];
  }

  const MenuRoutes: Array<TMenuOption> = [];
  Routes.forEach(RouteItem => {
    if (RouteItem.meta?.sideMenu) {
      MenuRoutes.push({
        label: NaiveUI.createdRouterLinkLabel(RouteItem.meta.menuLabel ?? RouteItem.meta.title, {
          to: {
            name: RouteItem.name
          }
        }),
        key: RouteItem.name.toString(),
        childrenNames: getChildrenRouteNames(RouteItem.children ?? []),
        index: RouteItem.meta.menuIndex ?? MenuRoutes.length + 1
      });
    }
    if (RouteItem.children) {
      MenuRoutes.push(...generateRouterMenuOptions(RouteItem.children));
    }
  });
  MenuRoutes.sort((a, b) => {
    return a.index - b.index;
  });
  return MenuRoutes;
}