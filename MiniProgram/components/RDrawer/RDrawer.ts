// components/base/TModal/TModal.ts
Component({
  options: {
    addGlobalClass: true,
    // virtualHost: true,
    styleIsolation: "apply-shared",
    multipleSlots: true
  },
  externalClasses: ["mask-style"],
  /**
   * 组件的属性列表
   */
  properties: {
    inside: {
      type: Boolean,
      value: false
    },
    position: {
      type: String,
      value: "fixed"
    },
    width: {
      type: String,
      value: "100vw",
    },
    height: {
      type: String,
      value: "52vh",
      observer() {
        this.updateBodyHeight();
      }
    },
    show: {
      type: Boolean,
      value: false,
      observer(newV) {
        if (newV === this.data.showModal) return;
        this.setData({
          showModal: newV
        })
      }
    },
    closeButton: {
      type: Boolean,
      value: true
    },
    maskClose: {
      type: Boolean,
      value: true
    },
    zIndex: {
      type: Number,
      value: 1
    },
    title: {
      type: String,
      value: ""
    },
    subtitle: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: false,
    bodyHeight: "100%"
  },

  lifetimes: {
    ready() {
      // this.updateBodyHeight();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeDrawer() {
      if (this.properties.maskClose) {
        this.setData({
          showModal: false
        });
      }
      this.triggerEvent("mask");
    },
    updateBodyHeight() {
      this.createSelectorQuery().select(".r-drawer").boundingClientRect(Drawer => {
        this.createSelectorQuery().select(".r-drawer-header").boundingClientRect(Header => {
          this.setData({
            bodyHeight: `${Drawer.height - Header.height}px`
          });
        }).exec();
      }).exec();
    }
  },
  observers: {
    showModal(newV) {
      this.triggerEvent("update", newV);
    }
  }
})
