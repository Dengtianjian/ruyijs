import MPStore from "./MPStore";
export default function <TData, TCustom>(options: WechatMiniprogram.Page.Options<TData, TCustom>, stores: MPStore[] = []) {
  const RuyiPageId = Date.now();

  const P = getCurrentPages()?.[0];
  if (P) {
    P['_RuyiPageId'] = RuyiPageId.toString();
  }

  // @ts-ignore
  options['_RuyiPageId'] = RuyiPageId.toString();
  Page<TData, TCustom>(options);
  stores.forEach(item => {
    item.pageLink(RuyiPageId.toString());
  });

  return;
}
