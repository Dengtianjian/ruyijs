export default {
  toast(title: string, icon: 'success' | 'error' | 'loading' | 'none' = "none", duration: number = 1500) {
    return wx.showToast({
      title,
      icon,
      duration
    });
  },
  loading(title: string, mask: boolean = true) {
    return wx.showLoading({
      title,
      mask
    });
  },
  hideLoading(noConflict: boolean = false) {
    return wx.hideLoading({
      noConflict
    });
  }
}