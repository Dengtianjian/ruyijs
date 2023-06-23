import { AllowedComponentProps, ComponentCustomProps, VNodeProps, VNode, RendererNode, RendererElement, VNodeChild } from "vue";
import { RouterLinkProps, RouteRecordRaw, RouteRecordName } from "vue-router";
import NaiveUI from "../foundation/naiveUI";
import { RTMenuOption } from "../types/components/Common";

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
export function generateRouterMenuOptions(Routes: RouteRecordRaw[], level: number | number[] | boolean = false, RouteName: string = null): Array<RTMenuOption> {
  if (RouteName) {
    Routes = getRoute(Routes, RouteName);
    if (!Routes) return [];
  }

  const MenuRoutes: Array<RTMenuOption> = [];
  Routes.forEach(RouteItem => {
    if (level === false || level && RouteItem.meta?.menu?.level) {
      if (level === false || (Array.isArray(level) && level.includes(RouteItem.meta.menu.level)) || level === RouteItem.meta.menu.level) {
        if (RouteItem.meta?.menu) {
          const Options = {
            key: RouteItem.name.toString(),
            childrenNames: getChildrenRouteNames(RouteItem.children ?? []),
            index: RouteItem.meta.menu?.index ?? MenuRoutes.length + 1,
          }

          if (RouteItem.meta.menu.disabled !== undefined) {
            Options['disabled'] = RouteItem.meta.menu.disabled;
          }
          if (RouteItem.meta.menu.show !== undefined) {
            Options['show'] = RouteItem.meta.menu.show;
          }
          if (RouteItem.meta.menu.extra !== undefined) {
            Options['extra'] = RouteItem.meta.menu.extra;
          }
          if (RouteItem.meta.menu.icon !== undefined) {
            Options['icon'] = RouteItem.meta.menu.icon;
          }
          if (RouteItem.meta.menu.type !== undefined) {
            Options['type'] = RouteItem.meta.menu.type;
            if (RouteItem.meta.menu.type === "group") {
              Options['label'] = RouteItem.meta.menu.label?.toString() ?? RouteItem.meta.title;
              if (RouteItem.children) {
                Options['children'] = generateRouterMenuOptions(RouteItem.children);
              } else {
                Options['children'] = [];
              }
            }
          } else {
            Options['label'] = NaiveUI.createdRouterLinkLabel(RouteItem.meta.menu.label?.toString() ?? RouteItem.meta.title, {
              to: {
                name: RouteItem.name
              }
            });
          }
          if (RouteItem.meta.menu.level !== undefined) {
            Options['level'] = RouteItem.meta.menu.level;
          }

          MenuRoutes.push(Options);
        }
      }
    }
    if (RouteItem.children && RouteItem.meta?.menu?.type !== 'group') {
      MenuRoutes.push(...generateRouterMenuOptions(RouteItem.children, level));
    }
  });
  MenuRoutes.sort((a, b) => {
    return a.index - b.index;
  });
  return MenuRoutes;
}