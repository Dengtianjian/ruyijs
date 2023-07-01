export default {
  dalayNavigateTo(url: string, delay: number = 1444, events: WechatMiniprogram.IAnyObject = {}, routeType: string = null) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        wx.navigateTo({
          url,
          events,
          routeType
        }).then(resolve).catch(reject);
      }, delay);
    })
  },
  dalaySwitchTab(url: string, delay: number = 1444) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        wx.switchTab({
          url
        }).then(resolve).catch(reject);
      }, delay);
    })
  },
  dalayNavigateBack(delta: number = 1, delay: number = 1444) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        wx.navigateBack({
          delta
        }).then(resolve).catch(reject);
      }, delay);
    })
  }
}