/* eslint-disable */
const { tabBarList } = require('./config');
const app = getApp();
Component({
  // options: {
  //   styleIsolation: 'shared',
  // },
  data: {
    selected: app.globalData?.selectedBar ?? 0,
    color: '#7A7E83',
    selectedColor: '#3cc51f',
    list: [...tabBarList]
  },
  ready() {
    const [currentPages] = getCurrentPages();
    const findIndex = this.data.list.findIndex((item) => item.pagePath === `/${currentPages.route}`);
    this.setData({
      selected: findIndex,
    })
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      // console.log(data, getCurrentPages(), app);
      const url = data.path;
      console.log(url)
      // const [currentPages] = getCurrentPages();

      // 是否需要用户鉴权
      // if (data.userAuth || !url) {
      //   if (!wx.getStorageSync('user').phone) {
      //     currentPages.$vm.dialogShow = true;
      //     return;
      //   }
      // }

      if (url) {
        app.globalData.selectedBar = data.index;

        this.setData(
          { selected: data.index },
          function () {
            wx.switchTab({ url });
          },
        );
      }
      //   else {
      //   currentPages.$vm.$alert('暂未开放, 尽情期待~');
      // }
    }
  }
});
